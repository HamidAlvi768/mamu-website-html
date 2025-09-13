// Course Detail Page - Dynamic Course Loading
// Loads single course from Firebase and renders course details

(function (window, document) {
    'use strict';

    if (!window.__fb || !window.__fb.db || !window.CourseAPI) {
        console.error('Firebase or CourseAPI not initialized');
        return;
    }

    var CourseAPI = window.CourseAPI;
    var CourseUtils = window.CourseUtils;

    function getIdFromPath() {
        // Expecting /courses/:id
        var parts = window.location.pathname.split('/').filter(Boolean);
        var courseIndex = parts.indexOf('courses');
        if (courseIndex !== -1 && parts.length > courseIndex + 1) {
            return decodeURIComponent(parts[courseIndex + 1]);
        }
        // Fallback to query ?id=
        var params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function renderCourseStructure(structure) {
        if (!structure || !Array.isArray(structure)) return '';

        var html = '';
        structure.forEach(function(item, index) {
            var collapseId = 'collapse-' + (index + 1);
            var itemId = 'collapse-item-' + (index + 1);
            var isActive = index === 0 ? 'active' : '';
            var showClass = index === 0 ? 'show' : '';
            var expanded = index === 0 ? 'true' : 'false';

            html += '<div class="accordion-card style3 ' + isActive + '">';
            html += '  <div class="accordion-header" id="' + itemId + '">';
            html += '    <button class="accordion-button ' + (index === 0 ? '' : 'collapsed') + '" type="button" data-bs-toggle="collapse" data-bs-target="#' + collapseId + '" aria-expanded="' + expanded + '" aria-controls="' + collapseId + '">' + (item.title || 'Course Section ' + (index + 1)) + '</button>';
            html += '  </div>';
            html += '  <div id="' + collapseId + '" class="accordion-collapse collapse ' + showClass + '" aria-labelledby="' + itemId + '" data-bs-parent="#faqAccordion">';
            html += '    <div class="accordion-body">';
            html += '      <p class="faq-text">' + (item.description || 'Course content will be available here.') + '</p>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
        });

        return html;
    }

    function renderCourse(course) {
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
        var bannerImage = course.bannerUrl || 'assets/img/cousrse/courses_details.jpg';
        var description = course.description || '';
        var structure = course.structure || [];
        var rating = course.rating || 0;
        var reviewCount = course.reviewCount || 0;

        var priceHTML = CourseUtils.formatPrice(price, originalPrice);
        var enrollmentHTML = CourseUtils.formatEnrollment(enrolledCount);
        var lessonsHTML = CourseUtils.formatLessons(lessonCount);
        var durationHTML = CourseUtils.formatDuration(duration);
        var ratingHTML = CourseUtils.formatRating(rating, reviewCount);

        // Update page title
        var titleElement = document.querySelector('.breadcumb-title');
        if (titleElement) {
            titleElement.textContent = title;
        }

        // Update course title
        var courseTitleElement = document.querySelector('.page-content h3.h2');
        if (courseTitleElement) {
            courseTitleElement.textContent = title;
        }

        // Update course image
        var courseImageElement = document.querySelector('.page-img img');
        if (courseImageElement) {
            courseImageElement.src = bannerImage;
            courseImageElement.alt = title;
        }

        // Update course price
        var priceElement = document.querySelector('.course-price h3.price');
        if (priceElement) {
            priceElement.innerHTML = priceHTML;
        }

        // Update course meta information
        var metaContainer = document.querySelector('.meta');
        if (metaContainer) {
            var metaHTML = '';
            metaHTML += '<div class="icon"><i class="fa-regular fa-book-open"></i>' + lessonsHTML + '</div>';
            metaHTML += '<span class="icon"><i class="fa-solid fa-user-graduate"></i>' + enrollmentHTML + '</span>';
            metaHTML += '<div class="icon"><i class="fa-sharp fa-light fa-clock"></i>' + durationHTML + '</div>';
            metaContainer.innerHTML = metaHTML;
        }

        // Update course description
        var descriptionElements = document.querySelectorAll('.blog-text');
        if (descriptionElements.length > 0 && description) {
            // Use the first description element and set innerHTML to support HTML content
            descriptionElements[0].innerHTML = description;
        }

        // Update course structure (accordion)
        var structureContainer = document.querySelector('#faqAccordion');
        if (structureContainer && structure.length > 0) {
            structureContainer.innerHTML = renderCourseStructure(structure);
        }

        // Update instructor information if sidebar exists
        var instructorElements = document.querySelectorAll('.box-profile');
        instructorElements.forEach(function(element) {
            var imgElement = element.querySelector('.box-author img');
            var nameElement = element.querySelector('.box-info h3.box-title');
            var titleElement = element.querySelector('.box-info .box-desig');

            if (imgElement) imgElement.src = instructorAvatar;
            if (nameElement) nameElement.textContent = instructorName;
            if (titleElement) titleElement.textContent = instructorTitle;
        });

        // Update rating if present
        var ratingElements = document.querySelectorAll('.rating');
        ratingElements.forEach(function(element) {
            if (ratingHTML) {
                element.innerHTML = ratingHTML;
            }
        });

        // Update page meta tags
        var metaTitle = document.querySelector('title');
        if (metaTitle) {
            metaTitle.textContent = title + ' - Tawba Islamic Center';
        }

        var metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && description) {
            // Strip HTML tags for meta description
            var plainText = description.replace(/<[^>]*>/g, '').substring(0, 160);
            metaDescription.setAttribute('content', plainText);
        }
    }

    function loadCourse() {
        var courseId = getIdFromPath();
        var container = document.querySelector('[data-course-container]');
        if (!container) {
            // Fallback: look for the main course content area
            container = document.querySelector('.page-single.course-single');
        }

        if (!container) {
            console.error('Course container not found');
            return;
        }

        if (!courseId) {
            container.innerHTML = '<p>Invalid course ID.</p>';
            return;
        }

        // Show loading state
        container.classList.add('loading');
        var loadingElement = document.createElement('div');
        loadingElement.className = 'text-center p-4';
        loadingElement.innerHTML = '<p>Loading course...</p>';
        container.appendChild(loadingElement);

        CourseAPI.getCourse(courseId)
            .then(function(course) {
                container.classList.remove('loading');
                if (loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                }

                if (!course) {
                    container.innerHTML = '<p>Course not found.</p>';
                    return;
                }

                renderCourse(course);
            })
            .catch(function(error) {
                console.error('Error loading course:', error);
                container.classList.remove('loading');
                if (loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                }
                container.innerHTML = '<p>Failed to load course. Please try again later.</p>';
            });
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', loadCourse);

})(window, document);
