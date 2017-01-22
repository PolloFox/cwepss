/**
 * Created by duchesne on 22/01/17.
 */
(function ($, Drupal) {
    /*global jQuery:false */
    /*global Drupal:false */
    "use strict";
    $( document ).ready(
        function() {
            $('a.accordion-open-close').on(
                'click',
                function(event) {
                    var arrowCurrentClass = ($(this).find('span.glyphicon:last-child').hasClass('glyphicon-menu-down'))?'glyphicon-menu-down':'glyphicon-menu-up';
                    var arrowTargetClass = ($(this).find('span.glyphicon:last-child').hasClass('glyphicon-menu-down'))?'glyphicon-menu-up':'glyphicon-menu-down';
                    $(this).find('span.glyphicon:last-child').removeClass(arrowCurrentClass).addClass(arrowTargetClass);
                }
            );
        }
    );
})(window.jQuery, window.Drupal);
