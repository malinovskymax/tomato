'use strict';

app.controller('MainController', ['$scope', '$timeout',
    function($scope, $timeout){
        $scope.mapParams = {
            rows: 10,
            cols: 10
        };

        $scope.map = [];
        $scope.anyTargets = false;
        $scope.running = false;
        $scope.tomatoDamageRange = 3;
        $scope.centerOffset = 0;
        $scope.whereCanThrow = [];
        $scope.bestPositions = {max: 0, positions: []};
        $scope.drawMap = function() {
            if(!$scope.mapParams.rows) {
                return;
            }
            $scope.map = [];
            $scope.anyTargets = true;
            for(var i = $scope.mapParams.rows - 1; i >= 0; i--) {
                $scope.map[i] = [];
                for(var j = $scope.mapParams.cols - 1; j >= 0; j--) {
                    $scope.map[i][j] = {target: false, row: i, col: j, canBeDefeated: false, inDefeatRange: false};
                }
            }
        };

        $scope.whereToThrowTomato = function() {
            if($scope.tomatoDamageRange % 2 === 0
                || $scope.tomatoDamageRange > $scope.mapParams.rows
                || $scope.tomatoDamageRange > $scope.mapParams.cols) {
                return;
            }
            $scope.centerOffset = Math.round($scope.tomatoDamageRange / 2);
            $scope.running = true;
            var rowStart = $scope.centerOffset - 1;
            var rowEnd = $scope.mapParams.rows - $scope.centerOffset;

            for(rowStart; rowStart <= rowEnd; ++rowStart) {
                var colStart = $scope.centerOffset - 1;
                var colEnd = $scope.mapParams.cols - $scope.centerOffset;

                for(colStart; colStart <= colEnd; ++colStart) {
                    $scope.whereCanThrow.push({row: rowStart, col: colStart})
                }
            }
            $scope.tryToThrow();
        };

        $scope.tryToThrow = function tryThrow() {
            if(!$scope.whereCanThrow.length) {
                $scope.hideForm = false;
                $scope.running = false;
                return;
            }
            var row = $scope.whereCanThrow[0].row;
            var col = $scope.whereCanThrow[0].col;
            var max = 0;
            for(var i = row - $scope.centerOffset + 1; i <= row + $scope.centerOffset - 1; i++) {
                for(var j = col - $scope.centerOffset + 1; j <= col + $scope.centerOffset - 1; j++) {
                    $scope.map[i][j].inDefeatRange = true;
                    if($scope.map[i][j].target) {
                        $scope.map[i][j].canBeDefeated = true;
                        max++;
                    }
                }
            }
            if(($scope.bestPositions.max <= max) && max) {
                if($scope.bestPositions.max < max) {
                    $scope.bestPositions.positions = [{row: row, col: col}];
                    $scope.bestPositions.max = max;
                } else {
                    $scope.bestPositions.positions.push({row: row, col: col})
                }
            }
            $timeout(function() {
                for(var i = row - $scope.centerOffset + 1; i <= row + $scope.centerOffset - 1; i++) {
                    for(var j = col - $scope.centerOffset + 1; j <= col + $scope.centerOffset - 1; j++) {
                        $scope.map[i][j].inDefeatRange = false;
                        $scope.map[i][j].canBeDefeated = false;
                    }
                }
            }, 500, true);
            $scope.whereCanThrow.shift();
            $timeout(tryThrow, 1200, true);
        };
    }
]);