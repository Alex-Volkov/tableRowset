;(function($){
    var methods = {
        init: function(options){
            return this.each(function(){
                var settings = {
                        colCount : 0,
                        rowCount : 0,
                        totalColCount : 0,
                        totalRowCount : 0,
                        maxCols : 10,
                        maxRows : 10,
                        defaultRows: 5,
                        defaultCols: 5,
                        onSet: $.noop
                    },
                    self = $(this);
                $.extend(settings, options);
                var $newTable = $(methods.makeTable(settings.defaultRows, settings.defaultCols));
                $newTable.appendTo(self);
                settings.self = self;
                if (typeof  self.data('settings') === 'undefined'){
                    self.data('settings', settings);
                    methods.setEvents.call(self, settings);
                }
            })
        },
        // modify array of initial settings
        changeSettings: function(params){
            return this.each(function(){
                var $this = $(this),
                    settings = $this.data('settings');
                console.log($this)
                console.log(params);

                console.log(settings);
                $.extend(settings, params);
                $this.data('settings', settings);
                $this.off('.tableRowset');
                methods.setEvents.call($this, settings);
                console.log($this.data('settings'));
            })
        },
        makeTable: function(cols, rows){
            console.log('making table');
            var newTable = '<div class="tableRowSetContainer">' +
                '<table class="growing">';
            for (var cnt = 0; cnt <  rows ; cnt++){
                newTable += '<tr>';
                for (var colCount = 0; colCount < cols; colCount++){
                    newTable += '<td></td>';
                }
                newTable +='</tr>';
            }
            newTable += '</table>';
            newTable += '<div class="counters"><span class="colCount">0</span> columns\
                        x\
                        <span class="rowCount">0</span> rows</div>\
                        </div>';
            return newTable;
        },
        updateColCount: function(){
            var settings = this.data('settings');
            settings.colCount = this.find('tr:eq(0)>td.cyan').length;
            settings.totalColCount = this.find('tr:eq(0)>td').length;
            this.data('settings', settings);
            this.find('.counters .colCount').text(settings.colCount);
        },
        updateRowCount: function(){
            var settings = this.data('settings');
            settings.rowCount = this.find('tr.cyanRow').length;
            settings.totalRowCount = this.find('tr').length;
            this.data('settings', settings)
            this.find('.counters .rowCount').text(settings.rowCount);
        },
        paintRow: function(rowIndex, colIndex){
            var settings = this.data('settings');
            this.find('tr').each(function(rowIdx, row){
                var $row = $(row),
                    $rowCells = $row.find('td');
                if (rowIdx <= rowIndex ){
                    $row.addClass('cyanRow');
                    $rowCells.each(function(cellIdx, cell){
                        if (cellIdx <= colIndex){
                            $(cell).addClass('cyan')
                        }else{
                            $(cell).removeClass('cyan')
                        }
                    })
                }else{
                    $row.removeClass('cyanRow');
                    $rowCells.each(function(cellIdx, cell){
                        $(cell).removeClass('cyan')
                    })
                }
            })
        },
        addCells: function(){
            var settings = this.data('settings');
            this.find('tr').each(function(rowIndex, row){
                if (settings.totalColCount < settings.maxCols)
                    $(row).append('<td/>');
            })
        },
        removeCells: function(cellIndex){
            var settings = this.data('settings');
            this.find('tr').each(function(rowIndex, row){
                if(cellIndex !== settings.maxCols -2)
                    $(row).find('td').last().remove();
            });
            methods.updateColCount.call(this);
        },
        addRows : function(rowIndex){
            var settings = this.data('settings');
            if (settings.totalRowCount < settings.maxRows){
                var newRow = '<tr>';
                for (var cnt = 0; cnt < this.find('tr:eq(0)').find('td').length ; cnt++){
                    newRow += '<td></td>';
                }
                newRow += '</tr>';
                if (this.hasClass('growing'))
                    this.append(newRow)
                else
                    this.find('.growing').append(newRow)
            }
        },
        removeRows: function(rowIndex){
            var settings = this.data('settings');
            if(rowIndex !== settings.maxRows -2){
                this.find('tr').last().remove();
            }
        },
        cleanUp: function(cellIndex, rowIndex){
            // clearing cols
            var settings = this.data('settings');
            if (settings.totalColCount -2 > cellIndex){
                this.find('tr')
                    .each(function(rowIndex, row){
                        $(row).find('td').each(function(cellIdx, cell){
                            if (cellIdx > cellIndex + 1 && cellIdx > 4){
                                $(cell).remove();
                            }
                        })
                    })
            }
            // clearing rows
            if (settings.totalRowCount -2 > rowIndex){
                this.find('tr')
                    .each(function(rowIdx, row){
                        if (rowIdx > rowIndex + 1 && rowIdx > 4){
                            $(row).remove();
                        }
                    })
            }
        },
        setEvents: function(){
            //            $('body')
            var settings = this.data('settings'),
                self = this,
                $table = self.hasClass('growing') ? self : self.find('.growing');
            $('html')
                // hide control on click outside .tableRowSetContainer
                .on('click.tableRowset', function(e){
                    var $target = $(e.target),
                        $container = self.find('.tableRowSetContainer');
                    if ($container.is(':visible') && !$target.hasClass('.tableRowSetContainer') || $target.parents('.tableRowSetContainer').length){
                        $container.hide();
                    }
                });
            this
                // toggle control
                .on('click.tableRowSet', function(){
                    $(this).find('.tableRowSetContainer').toggle();
                    return false;
                })
                // change the ammount of selected cells
                .on('hover.tableRowset', 'td', function(){
                    var thisCell = $(this),
                        thisRow = thisCell.closest('tr'),
                        thisColIndex = thisCell.index(),
                        thisRowIndex = thisRow.index();
                    self.data('settings', settings);
                    // add more columns
                    if (thisColIndex == settings.totalColCount - 1){
                        methods.addCells.call(self);
                    }
                    // remove columns
                    if (thisColIndex < settings.totalColCount - 1 && thisColIndex > 2 && thisColIndex < settings.colCount -1){
                        methods.removeCells.call(self, thisColIndex);
                    }
                    // add more rows
                    if (thisRowIndex == settings.totalRowCount -1){
                        methods.addRows.call(self);
                    }

                    // remove rows
                    if (thisRowIndex < settings.totalRowCount -1 && thisRowIndex > 2 && thisRowIndex < settings.rowCount -1){
                        methods.removeRows.call(self, thisRowIndex);
                    }
                    methods.cleanUp.call(self, thisColIndex, thisRowIndex);
                    methods.paintRow.call(self, thisRowIndex, thisColIndex);
                    methods.updateColCount.call(self);
                    methods.updateRowCount.call(self);
                })
                // selecting the ammount of rows/columns
                .on('click.tableRowset', 'td', function(){
                    var settings = self.data('settings');
                    self.find('.tableRowSetContainer').hide(100);
                    var result = {cols: settings.colCount, rows: settings.rowCount};
                    settings.onSet(result);
                    return result;
                });

        }
    }
    $.fn.tableRowSet = function(method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tableRowSet' );
        }
    };
})( jQuery );

