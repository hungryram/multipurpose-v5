'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import SectionHeader from '@/components/SectionHeader'
import {Button} from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Checkbox} from '@/components/ui/checkbox'
import {cn} from '@/lib/utils'
import PortableTextBlock from '@/components/PortableTextBlock'

interface FormField {
  _key: string
  fieldType: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  halfWidth?: boolean
}

interface ContactFormProps {
  content?: any[]
  formFields?: FormField[]
  submitButtonText?: string
  successMessage?: string
  notificationEmail?: string
  googleSheetId?: string
  googleSheetTabName?: string
  redirectAfterSubmit?: boolean
  redirectPage?: {
    linkType?: 'internal' | 'external' | 'path'
    internalLink?: {
      _type: string
      slug?: string
    }
    internalPath?: string
    externalUrl?: string
  }
  layout?: 'full' | 'centered' | 'split'
  sideContent?: any[]
  backgroundColor?: {hex: string}
  textAlign?: 'left' | 'center' | 'right'
}

// Build Zod schema dynamically from formFields
const buildValidationSchema = (fields: FormField[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  fields.forEach(field => {
    let fieldSchema: z.ZodTypeAny

    switch (field.fieldType) {
      case 'email':
        if (field.required) {
          fieldSchema = z.string().min(1, `${field.label} is required`).email('Please enter a valid email address')
        } else {
          fieldSchema = z.string().email('Please enter a valid email address').or(z.literal('')).optional()
        }
        break
      case 'tel':
        if (field.required) {
          fieldSchema = z.string().min(1, `${field.label} is required`).regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
        } else {
          fieldSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number').or(z.literal('')).optional()
        }
        break
      case 'checkbox':
        fieldSchema = field.required 
          ? z.boolean().refine(val => val === true, `${field.label} is required`) 
          : z.boolean().default(false)
        break
      case 'textarea':
      case 'text':
      case 'select':
      default:
        fieldSchema = field.required 
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional().or(z.literal(''))
    }

    schemaFields[field._key] = fieldSchema
  })

  return z.object(schemaFields)
}

export default function ContactForm({
  content,
  formFields = [],
  submitButtonText = 'Send Message',
  successMessage = 'Thank you for your message! We will get back to you soon.',
  notificationEmail,
  googleSheetId,
  googleSheetTabName,
  redirectAfterSubmit = false,
  redirectPage,
  layout = 'centered',
  sideContent,
  backgroundColor,
  textAlign = 'center',
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Early return if no fields
  if (!formFields || formFields.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No form fields configured. Please add fields in Sanity Studio.</p>
      </div>
    )
  }

  // Validate formFields structure
  const invalidFields = formFields.filter(f => !f._key || !f.fieldType || !f.label)
  if (invalidFields.length > 0) {
    console.error('ContactForm: Invalid field structure:', invalidFields)
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
        Error: Some form fields are missing required properties (_key, fieldType, or label).
      </div>
    )
  }

  let validationSchema: z.ZodObject<any>
  
  try {
    validationSchema = buildValidationSchema(formFields)
  } catch (error) {
    console.error('ContactForm: Error building validation schema', error, formFields)
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
        Error loading contact form. Schema validation failed.
      </div>
    )
  }

  type FormData = z.infer<typeof validationSchema>

  const defaultValues = formFields.reduce((acc, field) => {
    acc[field._key] = field.fieldType === 'checkbox' ? false : ''
    return acc
  }, {} as Record<string, any>)

  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  })

  const onSubmit = async (data: FormData) => {
    setStatus('submitting')

    // Create a map of field keys to labels for the email
    const fieldLabels = formFields.reduce((acc, field) => {
      acc[field._key] = field.label
      return acc
    }, {} as Record<string, string>)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          _notificationEmail: notificationEmail, // Include notification email from Sanity
          _googleSheetId: googleSheetId, // Include Google Sheet ID from Sanity
          _googleSheetTabName: googleSheetTabName, // Include Google Sheet tab name from Sanity
          _submittedFrom: typeof window !== 'undefined' ? window.location.href : '', // Include submission URL
          _fieldLabels: fieldLabels, // Include field labels for email formatting
        }),
      })

      if (response.ok) {
        setStatus('success')
        form.reset()
        
        // Redirect if configured
        if (redirectAfterSubmit && redirectPage) {
          // Build redirect URL from redirect page object
          let redirectUrl = null
          
          if (redirectPage.linkType === 'internal' && redirectPage.internalLink) {
            if (redirectPage.internalLink._type === 'home') {
              redirectUrl = '/'
            } else if (redirectPage.internalLink._type === 'blogIndex') {
              redirectUrl = '/blog'
            } else if (redirectPage.internalLink.slug) {
              redirectUrl = `/${redirectPage.internalLink.slug}`
            }
          } else if (redirectPage.linkType === 'path' && redirectPage.internalPath) {
            redirectUrl = redirectPage.internalPath
          } else if (redirectPage.linkType === 'external' && redirectPage.externalUrl) {
            redirectUrl = redirectPage.externalUrl
          }
          
          if (redirectUrl) {
            // Small delay to show success before redirect
            setTimeout(() => {
              window.location.href = redirectUrl
            }, 1000)
          }
        }
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const bgColor = backgroundColor?.hex || 'transparent'

  const renderField = (field: FormField) => (
    <FormField
      control={form.control}
      name={field._key as any}
      render={({field: formField}) => (
        <FormItem>
          <FormLabel>{field.label}{field.required && ' *'}</FormLabel>
          <FormControl>
            {field.fieldType === 'textarea' ? (
              <Textarea
                placeholder={field.placeholder}
                className="min-h-32"
                {...formField}
                value={(formField.value as string) || ''}
              />
            ) : field.fieldType === 'select' ? (
              <Select 
                onValueChange={formField.onChange} 
                value={(formField.value as string) || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.fieldType === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={(formField.value as boolean) || false}
                  onCheckedChange={formField.onChange}
                />
                <span className="text-sm">{field.placeholder}</span>
              </div>
            ) : (
              <Input
                type={field.fieldType}
                placeholder={field.placeholder}
                {...formField}
                value={(formField.value as string) || ''}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const formContent = (
    <div>
      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg">
          <p className="font-medium">{successMessage}</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <div key={field._key} className={cn(!field.halfWidth && 'md:col-span-2')}>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full"
              size="lg"
            >
              {status === 'submitting' ? 'Sending...' : submitButtonText}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )

  return (
    <div style={{backgroundColor: bgColor}}>
      {layout === 'split' && sideContent ? (
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <SectionHeader
              content={content}
              contentClassName="prose prose-lg max-w-none mb-8 [&>*:first-child]:text-3xl [&>*:first-child]:font-bold md:[&>*:first-child]:text-4xl"
              align={textAlign}
            />
            <div className="prose prose-lg max-w-none">
              <PortableTextBlock value={sideContent} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {formContent}
          </div>
        </div>
      ) : (
        <div className={cn(
          'mx-auto',
          layout === 'centered' ? 'max-w-2xl' : 'max-w-4xl'
        )}>
          <SectionHeader
            content={content}
            contentClassName="prose prose-lg max-w-none mb-12 [&>*:first-child]:text-3xl [&>*:first-child]:font-bold md:[&>*:first-child]:text-4xl"
            align={textAlign}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {formContent}
          </div>
        </div>
      )}
    </div>
  )
}