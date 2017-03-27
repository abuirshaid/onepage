(function($) {
    $.fn.triggerInViewEvent = function(options) {

        var options = $.extend({ inViewThreshold: 0.5, outOfViewThreshold: 0 }, options);

        var inViewThreshold = options.inViewThreshold;
        var outOfViewThreshold = options.outOfViewThreshold;

        // Return how much of the element is visible in the viewport
        var amountInView = function(elem) {
            var bounds = elem.getBoundingClientRect();
            var viewHeight = document.documentElement.clientHeight;

            var spannedHeight = Math.min(bounds.bottom, viewHeight) - Math.max(bounds.top, 0);
            var fullHeight = Math.min(bounds.bottom - bounds.top, viewHeight);
            return Math.max(spannedHeight / fullHeight, 0);
        };

        var hasEnteredView = function(index, elem) {
            return !$(elem).data('already-in-view') && amountInView(elem) >= inViewThreshold;
        };

        var hasExitedView = function(index, elem) {
            return $(elem).data('already-in-view') && amountInView(elem) <= outOfViewThreshold;
        };

        var $elems = this;

        var checkInView = function() {
            $elems.filter(hasEnteredView).data('already-in-view', true).trigger('in-view');
            $elems.filter(hasExitedView).data('already-in-view', false).trigger('out-of-view');
        };

        this.data('already-in-view', false);

        checkInView();
        $(window).scroll(checkInView);

        return this;
    };
}(jQuery));

$(function() {
    var scrollOffset = 0;

    var $navbarFootprint = $('[data-navbar-footprint]')
    var $navbar = $('[data-navbar]');

    if ($navbar.length > 0) {
        var navbarHeight = $navbar.outerHeight();
        scrollOffset = navbarHeight + 2;

        // Lock navbar footprint height so it doesn't resize when navbar goes sticky
        $navbarFootprint.height(navbarHeight - 1);

        // Add class to allow for sticky nav styling
        $(window).scroll(function() {
            var scrollTop = $(window).scrollTop();
            var navbarTop = $navbarFootprint.offset().top;
            if (scrollTop > navbarTop) {
                $navbar.addClass('-fixed');
            } else {
                $navbar.removeClass('-fixed');
            }
        });
    }
});

$(function() {
    function slickSlider(slides, pager) {
        $(slides)
            .slick({
                focusOnSelect: true,
                infinite: false,
                centerMode: true,
                variableWidth: true,
                arrows: true,
                dots: true,
                prevArrow: '<button type="button" class="slick-prev">&#x3c;</button>',
                nextArrow: '<button type="button" class="slick-next">&#x3e;</button>',
                dotsClass: 'verisol_inline-list',
                appendDots: $(pager),
                customPaging: function(slider, i) {
                    var label = slider.$slides.eq(i).attr('data-slide-label');
                    return $('<div class="verisol_tabitem"/>').text(label);
                },
                slidesToShow: 1,
                slidesToScroll: 2
            })
            .one('in-view', function() { $(this).removeClass('-offset'); })
            .triggerInViewEvent();
    }
    slickSlider('#visibilitySlides', '#visibilityPager');
    slickSlider('#tcoSlides', '#tcoPager');
});

$(function() {
    $('[data-add-class]').each(function() {
        $(this).click(function(e) {
            e.preventDefault();
            var args = $(this).attr('data-add-class').split(' ');
            var target = args[0];
            var className = args[1];
            $(target).addClass(className);
        })
    });
});

$(function() {
    $('[data-remove-class]').each(function() {
        $(this).click(function(e) {
            e.preventDefault();
            var args = $(this).attr('data-remove-class').split(' ');
            var target = args[0];
            var className = args[1];
            $(target).removeClass(className);
        })
    });
});

// Prevent click events bubbling up to the parent element(s)
$(function() {
    $('[data-stop-propagation]').click(function(event) {
        event.stopPropagation();
    });
});

$(function() {
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27 && $('body').hasClass('show-popover')) {
            $('body').removeClass('show-popover');
        }
    };
});

// window.onload = (function(_this) {
//     return function() {
//         $.fn.modal.Constructor.prototype.enforceFocus = function() {};
//     };
// })(this);
// $(function() {
//     $('[data-toggle="modal"]').on('click', function() {
//         var theModalId = $(this).data('target');

//         $(theModalId).on('show.bs.modal', function(event) {
//             var body = $("body");
//             var triggerButton = '#' + body.find('[data-target="' + theModalId + '"]').attr('id');
//             event.preventDefault();
//             var bodyChildren = [];
//             var dialog = $('<div></div>');
//             var parent;
//             var isOpen = false;
//             var contentCopy;

//             var attributes = $(theModalId).prop("attributes");

//             $.each(attributes, function() {
//                 dialog.attr(this.name, this.value);
//             });

//             var startCentinel = $('<span style="position: absolute;left: -9999px;" tabindex="0"></span>');
//             var startDialog = $('<a style="position: absolute;left: -9999px;" tabindex="0">Dialog start</a>');
//             var endDialog = $('<span style="position: absolute;left: -9999px;" tabindex="0">Dialog end</span>');
//             var endCentinel = $('<span style="position: absolute;left: -9999px;" tabindex="0"></span>');

//             startCentinel.focus(function() {
//                 endDialog.focus();
//             });

//             endCentinel.focus(function() {
//                 startDialog.focus();
//             });

//             var content = $(this).find('.modal-dialog');
//             var inner_content = $(this).find('.modal-content');

//             dialog.append(startCentinel);
//             dialog.append(startDialog);

//             parent = content.parent();
//             var contentToShow = content.clone(true);
//             contentCopy = content.clone(true);

//             dialog.append(content);
//             content.append(inner_content);

//             dialog.find('.modal-content').prepend(startCentinel);
//             dialog.find('.modal-content').prepend(startDialog);

//             dialog.find('.modal-content').append(endDialog);
//             dialog.find('.modal-content').append(endCentinel);

//             dialog.on('hide.bs.modal', function() {
//                 closeModal();
//             });

//             function closeModal() {
//                 if (!isOpen) return;
//                 isOpen = false;
//                 for (var i = 0, c; c = bodyChildren[i]; i++) {
//                     if (c.hadVal) {
//                         c.jqel.attr("aria-hidden", c.originalVal);
//                     } else {
//                         c.jqel.removeAttr("aria-hidden");
//                     }
//                 }
//                 dialog.remove();
//                 parent.append(contentCopy);
//                 $(triggerButton).focus();
//             }

//             body.children().each(function() {
//                 var jQchild = $(this);
//                 var o = {};
//                 o.jqel = jQchild;
//                 if (jQchild.attr("aria-hidden") !== undefined) {
//                     o.hadVal = true;
//                     o.originalVal = jQchild.attr("aria-hidden");
//                 } else {
//                     o.hadVal = false;
//                 }
//                 bodyChildren.push(o);
//                 jQchild.attr("aria-hidden", "true");
//             });
//             body.append(dialog);
//             $(this).remove();
//             dialog.on('shown.bs.modal', function() {
//                 $(inner_content).find('a').first().focus();
//             });
//             dialog.modal('show');
//             isOpen = true;
//         });
//     });
// });
