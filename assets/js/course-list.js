// Course Listing Page - Dynamic Course Loading
// Loads courses from Firebase and renders them dynamically

(function (window, document) {
    'use strict';

    if (!window.__fb || !window.__fb.db || !window.CourseAPI) {
        console.error('Firebase or CourseAPI not initialized');
        return;
    }

    var CourseAPI = window.CourseAPI;
    var CourseUtils = window.CourseUtils;

    function buildCourseCardHTML(course) {
        var id = course.id;
        var title = course.title || 'Untitled Course';
        var category = course.category || '';
        var price = course.price || 0;
        var originalPrice = course.originalPrice || null;
        var enrolledCount = course.enrolledCount || 0;
        var lessonCount = course.lessonCount || 0;
        var duration = course.duration || '';
        var instructorName = course.instructorName || '';
        var instructorTitle = course.instructorTitle || '';
        var instructorAvatar = course.instructorAvatarUrl || 'assets/img/cousrse/author_1_1.png';
        var thumbnail = course.thumbnailUrl || 'assets/img/cousrse/cousrse_1_1.jpg';
        var rating = course.rating || 0;
        var reviewCount = course.reviewCount || 0;

        var detailUrl = CourseUtils.getCourseDetailUrl(id);
        var priceHTML = CourseUtils.formatPrice(price, originalPrice);
        var enrollmentHTML = CourseUtils.formatEnrollment(enrolledCount);
        var lessonsHTML = CourseUtils.formatLessons(lessonCount);
        var durationHTML = CourseUtils.formatDuration(duration);
        var ratingHTML = CourseUtils.formatRating(rating, reviewCount);

        var html = '';
        html += '<div class="col-lg-6 col-xxl-4">';
        html += '  <div class="cousrse-card style2">';
        html += '    <div class="box-img global-img">';
        html += '      <img src="' + thumbnail + '" alt="' + title + '">';
        html += '    </div>';
        html += '    <div class="meta">';
        html += '      <span class="icon"><i class="fa-solid fa-user-graduate"></i>' + enrollmentHTML + '</span>';
        html += '      <div class="icon"><i class="fa-sharp fa-light fa-clock"></i>' + durationHTML + '</div>';
        html += '      <div class="icon"><i class="fa-regular fa-book-open"></i>' + lessonsHTML + '</div>';
        html += '    </div>';
        if (category) {
            html += '    <span class="tags">' + category + '</span>';
        }
        html += '    <h3 class="box-title"><a href="' + detailUrl + '">' + title + '</a></h3>';
        html += '    <div class="box-wrapp">';
        html += '      <div class="box-profile">';
        html += '        <div class="box-author">';
        html += '          <img src="' + instructorAvatar + '" alt="Instructor">';
        html += '        </div>';
        html += '        <div class="box-info">';
        html += '          <h3 class="box-title">' + instructorName + '</h3>';
        html += '          <span class="box-desig">' + instructorTitle + '</span>';
        html += '        </div>';
        html += '      </div>';
        if (ratingHTML) {
            html += '      <span class="rating">' + ratingHTML + '</span>';
        }
        html += '    </div>';
        html += '    <div class="btn-group justify-content-between">';
        html += '      <a class="th-btn border-btn2" href="' + detailUrl + '">Enroll Now</a>';
        html += '      <h4 class="price">' + priceHTML + '</h4>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        return html;
    }

    function renderCourses() {
        var container = document.querySelector('[data-course-list]');
        if (!container) {
            // Fallback: look for the course grid container
            container = document.querySelector('.row.gy-4');
        }
        
        if (!container) {
            console.error('Course container not found');
            return;
        }

        // Show loading state
        container.innerHTML = '<div class="col-12 text-center"><p>Loading courses...</p></div>';

        // Get URL parameters for filtering
        var params = new URLSearchParams(window.location.search);
        var category = params.get('category');

        // Load courses based on filter
        var coursePromise;
        if (category) {
            coursePromise = CourseAPI.getCoursesByCategory(category);
        } else {
            coursePromise = CourseAPI.listCourses();
        }

        coursePromise
            .then(function(courses) {
                if (!courses || courses.length === 0) {
                    container.innerHTML = '<div class="col-12 text-center"><p>No courses found.</p></div>';
                    return;
                }

                var html = '';
                courses.forEach(function(course) {
                    html += buildCourseCardHTML(course);
                });

                container.innerHTML = html;

                // Update page title if filtered by category
                if (category) {
                    var titleElement = document.querySelector('.breadcumb-title');
                    if (titleElement) {
                        titleElement.textContent = category + ' Courses';
                    }
                }
            })
            .catch(function(error) {
                console.error('Error loading courses:', error);
                container.innerHTML = '<div class="col-12 text-center"><p>Failed to load courses. Please try again later.</p></div>';
            });
    }

    function renderCategoryFilter() {
        var categoryContainer = document.querySelector('[data-category-filter]');
        if (!categoryContainer || !window.CategoryAPI) return;

        window.CategoryAPI.listCategories()
            .then(function(categories) {
                if (!categories || categories.length === 0) return;

                var html = '<div class="course-filter mb-4">';
                html += '<h4>Filter by Category:</h4>';
                html += '<div class="filter-buttons">';
                html += '<a href="popular-courses.html" class="btn btn-outline-primary me-2 mb-2">All Courses</a>';
                
                categories.forEach(function(category) {
                    var url = CourseUtils.getCourseListUrl({ category: category.name });
                    html += '<a href="' + url + '" class="btn btn-outline-primary me-2 mb-2">' + category.name + '</a>';
                });
                
                html += '</div></div>';

                // Insert before the course grid
                var courseContainer = document.querySelector('[data-course-list]') || document.querySelector('.row.gy-4');
                if (courseContainer && courseContainer.parentNode) {
                    courseContainer.parentNode.insertBefore(document.createElement('div').innerHTML = html, courseContainer);
                }
            })
            .catch(function(error) {
                console.error('Error loading categories:', error);
            });
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        renderCourses();
        renderCategoryFilter();
    });

})(window, document);
