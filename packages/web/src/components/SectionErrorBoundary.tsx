'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  sectionName: string
}

interface State {
  hasError: boolean
}

export default class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in section ${this.props.sectionName}:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-12 text-center">
          <p className="text-red-500">Error loading {this.props.sectionName} section</p>
        </div>
      )
    }
    return this.props.children
  }
}
