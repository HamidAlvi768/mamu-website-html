// Firebase Course Helper Functions
// Provides functions to interact with courses and categories collections

(function (window, document) {
    'use strict';

    if (!window.__fb || !window.__fb.db) {
        console.error('Firebase not initialized');
        return;
    }

    var db = window.__fb.db;

    // Course helper functions
    window.CourseAPI = {
        // Get all courses
        listCourses: function() {
            return db.collection('courses')
                .orderBy('createdAt', 'desc')
                .get()
                .then(function(snapshot) {
                    var courses = [];
                    snapshot.forEach(function(doc) {
                        courses.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    return courses;
                });
        },

        // Get single course by ID
        getCourse: function(courseId) {
            return db.collection('courses').doc(courseId).get()
                .then(function(doc) {
                    if (doc.exists) {
                        return {
                            id: doc.id,
                            ...doc.data()
                        };
                    }
                    return null;
                });
        },

        // Get courses by category
        getCoursesByCategory: function(categoryName) {
            return db.collection('courses')
                .where('category', '==', categoryName)
                .orderBy('createdAt', 'desc')
                .get()
                .then(function(snapshot) {
                    var courses = [];
                    snapshot.forEach(function(doc) {
                        courses.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    return courses;
                });
        },

        // Get featured courses (if you have a featured field)
        getFeaturedCourses: function(limit = 6) {
            return db.collection('courses')
                .where('featured', '==', true)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get()
                .then(function(snapshot) {
                    var courses = [];
                    snapshot.forEach(function(doc) {
                        courses.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    return courses;
                });
        }
    };

    // Category helper functions
    window.CategoryAPI = {
        // Get all categories
        listCategories: function() {
            return db.collection('categories')
                .orderBy('name', 'asc')
                .get()
                .then(function(snapshot) {
                    var categories = [];
                    snapshot.forEach(function(doc) {
                        categories.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    return categories;
                });
        },

        // Get single category by ID
        getCategory: function(categoryId) {
            return db.collection('categories').doc(categoryId).get()
                .then(function(doc) {
                    if (doc.exists) {
                        return {
                            id: doc.id,
                            ...doc.data()
                        };
                    }
                    return null;
                });
        },

        // Get category by name
        getCategoryByName: function(categoryName) {
            return db.collection('categories')
                .where('name', '==', categoryName)
                .limit(1)
                .get()
                .then(function(snapshot) {
                    if (!snapshot.empty) {
                        var doc = snapshot.docs[0];
                        return {
                            id: doc.id,
                            ...doc.data()
                        };
                    }
                    return null;
                });
        }
    };

    // Utility functions for course data formatting
    window.CourseUtils = {
        // Format course price
        formatPrice: function(price, originalPrice) {
            if (!price) return '';
            var priceStr = '$' + parseFloat(price).toFixed(2);
            if (originalPrice && originalPrice > price) {
                priceStr += ' <del class="del">$' + parseFloat(originalPrice).toFixed(2) + '</del>';
            }
            return priceStr;
        },

        // Format course duration
        formatDuration: function(duration) {
            if (!duration) return '';
            return duration + ' Duration';
        },

        // Format enrollment count
        formatEnrollment: function(count) {
            if (!count) return '0 Enrolled';
            return count + ' Enrolled';
        },

        // Format lesson count
        formatLessons: function(count) {
            if (!count) return '0 Lessons';
            return count + ' Lessons';
        },

        // Format rating
        formatRating: function(rating, reviewCount) {
            if (!rating) return '';
            var ratingStr = '<i class="fa-solid fa-star"></i>' + parseFloat(rating).toFixed(1);
            if (reviewCount) {
                ratingStr += ' (' + reviewCount + ')';
            }
            return ratingStr;
        },

        // Generate course detail URL
        getCourseDetailUrl: function(courseId) {
            var isFile = (window.location.protocol === 'file:');
            if (isFile) {
                return 'courses-details.html?id=' + encodeURIComponent(courseId);
            }
            return '/courses/' + encodeURIComponent(courseId);
        },

        // Generate course listing URL
        getCourseListUrl: function(params) {
            var isFile = (window.location.protocol === 'file:');
            var url = isFile ? 'popular-courses.html' : '/courses';
            
            if (params && params.category) {
                var separator = isFile ? '?' : '?';
                url += separator + 'category=' + encodeURIComponent(params.category);
            }
            
            return url;
        }
    };

})(window, document);
