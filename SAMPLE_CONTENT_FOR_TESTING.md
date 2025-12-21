# Sample Content for Testing Internal Link Suggestions

## Quick Setup Instructions

1. Go to your Sanity Studio: http://localhost:3333
2. Create the categories and posts below to test the feature

---

## Step 1: Create Categories

Go to **Categories** and create these:

1. **Outdoor Gear**
2. **Hiking Tips**  
3. **Travel**

---

## Step 2: Create Tags

Go to **Tags** and create these:

1. **hiking**
2. **backpacking**
3. **footwear**
4. **gear-reviews**

---

## Step 3: Create Sample Posts

### Post 1: "10 Best Hiking Boots for 2025"
- **Slug**: `best-hiking-boots-2025`
- **Excerpt**: `Discover the top hiking boots reviewed and tested on real trails`
- **Category**: Outdoor Gear
- **Tags**: hiking, footwear, gear-reviews
- **Body**: Add any text content
- **Published**: Yes (set published date)

### Post 2: "Essential Backpacking Gear Guide"
- **Slug**: `essential-backpacking-gear`
- **Excerpt**: `Complete guide to what you need for a multi-day backpacking trip`
- **Category**: Outdoor Gear
- **Tags**: backpacking, hiking, gear-reviews
- **Body**: Add any text content
- **Published**: Yes

### Post 3: "How to Choose the Right Hiking Socks"
- **Slug**: `choosing-hiking-socks`
- **Excerpt**: `The ultimate guide to selecting hiking socks for comfort and blister prevention`
- **Category**: Outdoor Gear
- **Tags**: hiking, footwear
- **Body**: Add any text content
- **Published**: Yes

### Post 4: "Top 10 Hiking Trails in Colorado"
- **Slug**: `colorado-hiking-trails`
- **Excerpt**: `Explore the most scenic hiking trails Colorado has to offer`
- **Category**: Hiking Tips
- **Tags**: hiking, travel
- **Body**: Add any text content
- **Published**: Yes

### Post 5: "Beginner's Guide to Backpacking"
- **Slug**: `beginners-guide-backpacking`
- **Excerpt**: `Everything a beginner needs to know before their first backpacking trip`
- **Category**: Hiking Tips
- **Tags**: backpacking, hiking
- **Body**: Add any text content
- **Published**: Yes

---

## Testing the Feature

1. **Open "10 Best Hiking Boots for 2025"** post
2. **Scroll to "Internal Link Suggestions"** (above SEO section)
3. **You should see:**
   - 🎯 Green badge: "Essential Backpacking Gear Guide" (same Outdoor Gear category)
   - 🎯 Green badge: "How to Choose the Right Hiking Socks" (same category)
   - 🏷️ Yellow badge: "Beginner's Guide to Backpacking" (shared tags: hiking, backpacking)
   - 🏷️ Yellow badge: "Top 10 Hiking Trails in Colorado" (shared tag: hiking)

4. **Click any suggestion** to copy the path
5. **Paste into your content** as an internal link

---

## Expected Results

**For "10 Best Hiking Boots"** (Category: Outdoor Gear, Tags: hiking, footwear, gear-reviews):
- Shows "Essential Backpacking Gear Guide" with 🎯 (same category)
- Shows "Hiking Socks" with 🎯 (same category)
- Shows "Beginner's Guide" with 🏷️ (2 shared tags)
- Shows "Colorado Trails" with 🏷️ (1 shared tag)

**Priority order proves the smart matching works:**
1. Same category posts first (green 🎯)
2. Multiple shared tags next (yellow 🏷️)
3. Single shared tag
4. Other recent posts

This demonstrates that the suggestions are contextually relevant, not just random recent posts!
