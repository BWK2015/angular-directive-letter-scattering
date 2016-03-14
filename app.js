angular.module('app', [])
    .directive('scatterEffect', ['$document',function($document){
        return ({
            compile: compile,
            restrict: 'A'
        });
        
        function compile(element, attribute){
            console.log(element);
            console.log(attribute);
            
            wrapLetters(element);
            
            function findTextNodes(parent){
                console.log(angular.element(parent).contents());
                var textNodes = angular.element(parent).contents().map(
                    function(i, node){
                        return (
                            (node.nodeType === 1) ? findTextNodes(node) : node
                        );
                    });
                console.log(textNodes.toArray());
                return (textNodes.toArray());
            };
            
            function wrapLetters(parent){
                findTextNodes(parent).forEach(
                    function(node){
                        console.log(node);
                        var wrappedHtml = node.nodeValue.replace(/([^\s])/g, "<span class='scatter-items'>$1</span>");
                        var fragment = angular.element(document.createDocumentFragment()).append(wrappedHtml);
                        node.parentNode.insertBefore(fragment[0], node);
                        node.parentNode.removeChild(node);
                    })
            };
            
            return (
                function link(scope, element, attribute){
                    var convergeTarget = attribute.scatterEffect ? angular.element(attribute.scatterEffect) : element;
                    
                    var maxScatterDistance = (parseInt(attribute.scatterDistance, 10) || 500);
                    
                    var letters = element.find('span.scatter-items')
                                    .map(function(i, node){
                                        return ({
                                            target: angular.element(node),
                                            maxX: generateRandomOffset(),
                                            maxY: generateRandomOffset()
                                        })
                                    }).toArray();
                
                    console.log(letters);
                    
                    function generateRandomOffset(){
                        for(var i = 0; i < 50; i++){
                            var value = (maxScatterDistance-(Math.random()*maxScatterDistance*2))
                        }
                        console.log('max: ' + value)
                        return value
                    };
                    
                    $document.on('mousemove', handleMousemove);
                    
                    function getDistanceFromConverge(convergeTarget, x, y){
                        var offset = convergeTarget.offset();
                        console.log(offset);
                        var width = convergeTarget.outerWidth();
                        console.log(width);
                        var height = convergeTarget.outerHeight();
                        console.log(height);
                        
                        var top = offset.top;
                        var left = offset.left;
                        var right = (left + width);
                        var bottom =(top + height);
                        
                        if(x < left){
                            var deltaX = (left - x);   
                        }else if(x > right){
                            var deltaX = (x - right);   
                        } else {
                            var deltaX = 0;   
                        }
                        if(y < top){
                            var deltaY = (top - y);
                        } else if(y > bottom){
                            var deltaY = (y - bottom);   
                        } else {
                            var deltaY = 0;   
                        }
                        
                        return (Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)));
                    }
                    
                    function handleMousemove(){
                        var distance = getDistanceFromConverge(convergeTarget, event.pageX, event.pageY);
                        positionScatterItems(distance);
                    };
                    
                    function positionScatterItems(distance){
                        var percentage = Math.min(1, (distance/maxScatterDistance));
                        console.log('percentage:' + percentage);
                        letters.forEach(function(letter){
                            letter.target.css({
                                left: Math.floor(letter.maxX * percentage),
                                top: Math.floor(letter.maxY * percentage)
                            })
                        })
                    };
                }
            );
        }
    }]);