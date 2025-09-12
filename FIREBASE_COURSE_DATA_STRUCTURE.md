# Firebase Course Data Structure

This document outlines the expected data structure for the dynamic course system.

## Collections

### 1. `courses` Collection

Each course document should have the following fields:

```javascript
{
  // Basic Information
  title: "Islamic Philosophy and Quranic Studies",
  description: "<p>This comprehensive course explores the deep philosophical foundations of Islamic thought...</p>",
  category: "Philosophy", // Should match a category name in categories collection
  
  // Pricing
  price: 280.00,
  originalPrice: 320.00, // Optional, for showing discounts
  
  // Course Stats
  lessonCount: 120,
  enrolledCount: 250,
  duration: "8 Week Duration",
  rating: 4.8,
  reviewCount: 12000,
  
  // Images
  thumbnailUrl: "assets/img/cousrse/cousrse_1_1.jpg",
  bannerUrl: "assets/img/cousrse/courses_details.jpg",
  
  // Instructor Information
  instructorName: "Ibrahim Abdullah",
  instructorTitle: "Islamic Scholar",
  instructorAvatarUrl: "assets/img/cousrse/author_1_1.png",
  
  // Course Structure (Array of sections)
  structure: [
    {
      title: "Quranic Studies, Level 1",
      description: "Introduction to Quranic studies and basic principles..."
    },
    {
      title: "History of Islam, Level 2", 
      description: "Comprehensive study of Islamic history from the Prophet's time..."
    },
    {
      title: "Philosophy and Quranic Studies, Level 3",
      description: "Advanced philosophical concepts in Islamic thought..."
    }
  ],
  
  // Metadata
  featured: true, // Optional, for featured courses
  createdAt: firebase.firestore.Timestamp.now(),
  updatedAt: firebase.firestore.Timestamp.now()
}
```

### 2. `categories` Collection

Each category document should have:

```javascript
{
  name: "Philosophy",
  description: "Courses focusing on Islamic philosophy and theological studies",
  createdAt: firebase.firestore.Timestamp.now()
}
```

## Sample Data for Testing

### Sample Categories

```javascript
// Category 1
{
  name: "Philosophy",
  description: "Courses focusing on Islamic philosophy and theological studies"
}

// Category 2  
{
  name: "Maktab",
  description: "Basic Islamic education and foundational courses"
}

// Category 3
{
  name: "Quranic Studies", 
  description: "In-depth study of the Quran, its interpretation and application"
}

// Category 4
{
  name: "Islamic Scholar",
  description: "Advanced courses for Islamic scholarship and research"
}

// Category 5
{
  name: "Shariah Laws",
  description: "Islamic jurisprudence and legal studies"
}
```

### Sample Course

```javascript
{
  title: "The Islamic Philosophy and Quranic Studies",
  description: "<p>The Qur'an is the holy book of Islam, believed to be the literal word of God (Allah) as revealed to the Prophet Muhammad (PBUH) over a period of approximately 23 years. It is considered the final and most complete revelation, following earlier scriptures such as the Torah and the Bible.</p><p>The Qur'an is written in classical Arabic and is divided into 114 chapters (Surahs) and over 6,000 verses (Ayahs). It is also highly regarded for its linguistic beauty, structure, and depth of meaning, often considered a miraculous revelation in both content and form.</p>",
  category: "Philosophy",
  price: 280.00,
  originalPrice: 320.00,
  lessonCount: 120,
  enrolledCount: 250,
  duration: "8 Week Duration",
  rating: 4.8,
  reviewCount: 12000,
  thumbnailUrl: "assets/img/cousrse/cousrse_1_1.jpg",
  bannerUrl: "assets/img/cousrse/courses_details.jpg",
  instructorName: "Ibrahim Abdullah",
  instructorTitle: "Islamic Scholar",
  instructorAvatarUrl: "assets/img/cousrse/author_1_1.png",
  structure: [
    {
      title: "Quranic Studies, Level 1",
      description: "Quranic studies provide inadequate to power a product or system effectively. To address this, we incorporate onboard batteries to provide supplementary power. However, the temperature can influence battery performance, workshop provides particularly charging and discharging."
    },
    {
      title: "History of Islam, Level 2",
      description: "Quranic studies provide inadequate to power a product or system effectively. To address this, we incorporate onboard batteries to provide supplementary power. However, the temperature can influence battery performance, workshop provides particularly charging and discharging."
    },
    {
      title: "History of Islam, Level 3", 
      description: "Quranic studies provide inadequate to power a product or system effectively. To address this, we incorporate onboard batteries to provide supplementary power. However, the temperature can influence battery performance, workshop provides particularly charging and discharging."
    },
    {
      title: "Philosophy and Quranic Studies, Level 4",
      description: "Quranic studies provide inadequate to power a product or system effectively. To address this, we incorporate onboard batteries to provide supplementary power. However, the temperature can influence battery performance, workshop provides particularly charging and discharging."
    }
  ],
  featured: true,
  createdAt: firebase.firestore.Timestamp.now(),
  updatedAt: firebase.firestore.Timestamp.now()
}
```

## URL Structure

### Course Listing
- All courses: `popular-courses.html`
- By category: `popular-courses.html?category=Philosophy`

### Course Details  
- By ID: `courses-details.html?id=COURSE_ID`

## Features Implemented

1. **Dynamic Course Loading**: Courses are loaded from Firebase and rendered dynamically
2. **Category Filtering**: Filter courses by category using URL parameters
3. **Responsive Design**: Maintains the original responsive design
4. **SEO Friendly**: Updates page titles and meta descriptions
5. **Error Handling**: Graceful error handling for missing data
6. **Loading States**: Shows loading indicators while fetching data
7. **Fallback Content**: Uses default content when Firebase data is unavailable

## Testing

To test the implementation:

1. Add sample data to your Firebase Firestore collections
2. Open `popular-courses.html` to see the course listing
3. Click on a course to see the detail page
4. Test category filtering by adding `?category=Philosophy` to the URL
5. Check browser console for any errors

## Notes

- The `description` field supports HTML content for rich text formatting
- All timestamps should be Firebase Timestamps for proper date handling
- Image URLs can be relative paths to local assets or full URLs
- The system gracefully handles missing optional fields
- Course structure is rendered as Bootstrap accordions
