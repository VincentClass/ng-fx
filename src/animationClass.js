angular.module('animations.create', [])

.factory('Animation', ['$timeout', '$window', function ($timeout, $window){
  var getScope = function(e){
    return angular.element(e).scope();
  };
  var complete = function(element, name){
    var $scope = getScope(element);
    return function (){
      $scope.$emit(name);
    };
  };

  var getEase = function(element){
    var reg = /(easing-)\w*\D\w*/;
    var classes = element[0].className.match(reg);
    var ease;
    if(classes){
      ease = classes[0].split('-').splice(1);
      ease = ease[0].split(' ')[0];
      return ease;
    }
    return ease;
  };
  var convertElement = function(element){
    return Array.prototype.slice.call(element);
  };
  return {
    create: function(effect){
      var inEffect        = effect.enter,
          outEffect       = effect.leave,
          outEffectLeave  = effect.inverse || effect.leave,
          duration        = effect.duration,
          enter,
          leave,
          move;

      this.enter = function(element, done){
        var easeType = getEase(convertElement(element)).cap();
        inEffect.onComplete = complete(element, effect.class);
        inEffect.ease = $window[easeType].easeOut;
        TweenMax.set(element, outEffect);
        enter = TweenMax.to(element, duration, inEffect);
        return function (canceled){
          if(canceled){
            $timeout(function(){
              angular.element(element).remove();
            }, 300);
          } else {
            enter.resume();
          }
        };
      };

      this.leave = function(element, done){
        var easeType = getEase(convertElement(element)).cap();
        outEffect.onComplete = done;
        outEffect.ease = $window[easeType].easeIn;
        TweenMax.set(element, inEffect);
        leave = TweenMax.to(element, duration, outEffectLeave);
        return function (canceled){
          if(canceled){

          }
        };
      };

      this.move = function(element, done){
        console.log('move');
        inEffect.onComplete = done;
        TweenMax.set(element, outEffect);
        move = TweenMax.to(element. duration, inEffect);
        return function (canceled){
          if(canceled){

            move.kill();
          }
        };
      };

      this.beforeAddClass = function(element, className, done){
        outEffect.onComplete = done;
        if(className === 'ng-hide'){
          TweenMax.to(element, duration, outEffectLeave);
        } else {
          done();
        }
      };

      this.removeClass = function(element, className, done){
        inEffect.onComplete = done;
        if(className === 'ng-hide'){
          TweenMax.set(element, outEffect);
          TweenMax.to(element, duration, inEffect);
        } else {
          done();
        }
      };
    }
  };
}]);

String.prototype.cap = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};