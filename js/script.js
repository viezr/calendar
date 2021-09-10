/*
    Calendar
*/
let current_year, today_year;
let current_month, today_month;
let current_day, today;
let sunday_shift = true;
let source_date;
let date_start;

let calendar = {
    /*
        Main calendar block object
    */
    board_cols: 7,
    board_rows: 7,
    board_cells: 49,
    cell_size: 40,
    border_size: 0,
    date_start: [],
    cal_div: document.querySelector( "#calendar" ),
    header_arr: [],
    cells_arr: [],

    months: [
        { "name": "January", "days": 31, "number": 0 },
        { "name": "February", "days": 28, "number": 1 },
        { "name": "March", "days": 31, "number": 2 },
        { "name": "April", "days": 30, "number": 3 },
        { "name": "May", "days": 31, "number": 4 },
        { "name": "June", "days": 30, "number": 5 },
        { "name": "July", "days": 31, "number": 6 },
        { "name": "August", "days": 31, "number": 7 },
        { "name": "September", "days": 30, "number": 8 },
        { "name": "October", "days": 31, "number": 9 },
        { "name": "November", "days": 30, "number": 10 },
        { "name": "December", "days": 31, "number": 11 }
    ],

    weekdays: [
        { "name": "Sunday", "number": 0 },
        { "name": "Monday", "number": 1 },
        { "name": "Tuesday", "number": 2 },
        { "name": "Wednesday", "number": 3 },
        { "name": "Thursday", "number": 4 },
        { "name": "Friday", "number": 5 },
        { "name": "Saturday", "number": 6 },
    ],

    weekend_arr: [
        [ 7, 14, 21, 28, 35, 42, 49, 56 ],
        [ 12, 13, 19, 20, 26, 27, 33, 34, 40, 41, 47, 48, 54, 55 ]
    ],

    create_cell: function( i ) {
        /*
            Create day cell
        */
        this.cells_arr[ i ] = document.createElement( "div" );
        this.cells_arr[ i ].style.width = this.cell_size.toString() + "px";
        this.cells_arr[ i ].style.height = this.cells_arr[ i ].style.width;
        this.cells_arr[ i ].id = "day-" + i.toString();
        this.cells_arr[ i ].style.display = "inline-block";
    },

    header: function() {
        /*
            Create calendar header
        */
        let header = document.createElement( "div" );
        let left_sign = "\u25c0", right_sign = "\u25b6";
        let btn_class = "btn btn-primary btn-cal";
        let month_name = this.months[ current_month ].name;
        header.className = "cal-header";
        header.onclick = btn_handler;
        let header_blocks = [
            { "type": "button", "class": btn_class, "id": "month-prev", "text": left_sign },
            { "type": "h2", "class": "cal-title", "id": "cal-month", "text": month_name },
            { "type": "button", "class": btn_class, "id": "month-next", "text": right_sign },
            { "type": "button", "class": btn_class, "id": "year-prev", "text": left_sign },
            { "type": "h2", "class": "cal-title", "id": "cal-year", "text": current_year },
            { "type": "button", "class": btn_class, "id": "year-next", "text": right_sign },
        ];
        for( i in header_blocks ) {
            this.header_arr[ i ] = document.createElement( header_blocks[ i ][ "type" ] );
            this.header_arr[ i ].style.display = "inline-block";
            this.header_arr[ i ].className = header_blocks[ i ][ "class" ];
            this.header_arr[ i ].id = header_blocks[ i ][ "id" ];
            this.header_arr[ i ].innerHTML = header_blocks[ i ][ "text" ];
            header.appendChild( this.header_arr[ i ] );
        }
        this.cal_div.appendChild( header );
    },

    fill_weekdays: function( i ) {
        /*
            Set styles for weekdays and weekend
        */
        let wday = ( i + sunday_shift ) > 6 ? 0 : i + sunday_shift;
        this.cells_arr[ i ].className = "cal-weekday";
        if( sunday_shift && i > 4 ) {
            this.cells_arr[ i ].className += " cal-weekend";
        } else if( !sunday_shift && i == 0 ) {
            this.cells_arr[ i ].className += " cal-weekend";
        }
        this.cells_arr[ i ].innerHTML = this.weekdays[ wday ].name.slice( 0, 2 );
    },

    fill_cell: function( i, i_day, date ) {
        /*
            Fill cells with days number
        */
        let date_put = new Date( date[ 0 ], date[ 1 ], date[ 2 ] + i_day );
        let year_put = date_put.getFullYear();
        let month_put = date_put.getMonth();
        let day_put = date_put.getDate();
        if( month_put != current_month ) {
            this.cells_arr[ i ].className = "cell-other";
            if( this.weekend_arr[ Number( sunday_shift ) ].includes( i ) ) {
                this.cells_arr[ i ].className += " cal-weekend-other";
            }
        } else {
            this.cells_arr[ i ].className = "cell-current";
            if( this.weekend_arr[ Number( sunday_shift ) ].includes( i ) ) {
                this.cells_arr[ i ].className += " cal-weekend";
            }
        }
        if( year_put == today_year &&
            month_put == today_month &&
            day_put == today )
        {
            this.cells_arr[ i ].className += " cal-today";
        }
        this.cells_arr[ i ].innerHTML = day_put.toString();
    },

    init: function( date ) {
        /*
            Create calendar block
        */
        this.cal_div.style.width = (
            this.board_cols * this.cell_size + ( this.border_size * 2 )
            ).toString() + "px";
        this.header();
        this.update( date, true, true );
    },

    update: function( date, initial = false, weekdays = false ) {
        /*
            Update calendar block
        */
        for( let i = 0, i_day = -7, cell; i < this.board_cells; i++, i_day++ ) {
            if( initial ) {
                this.create_cell( i );
            }
            if( i < 7 ) {
                if( weekdays ) {
                    this.fill_weekdays( i );
                } else {
                    continue;
                }
            } else {
                this.fill_cell( i, i_day, date );
            }
            if( initial ) {
                this.cal_div.appendChild( this.cells_arr[ i ] );
            }
        }
        this.header_arr[ 1 ].innerHTML = this.months[ current_month ].name;
        this.header_arr[ 4 ].innerHTML = current_year;
    }
}

let sidebar = {
    /*
        Sidebar object
    */
    bar_div: document.querySelector( ".sidebar" ),
    leap_info: document.createElement( "p" ),
    days_info: document.createElement( "p" ),
    days_text: () => leap_year( current_year ) ? "366" : "365",
    prev_year: current_year,
    leap_info_text: function () {
        if( leap_year( current_year ) ) {
            return current_year + " - leap year";
        }
        return current_year + " - not leap";
    },

    init: function() {
        /*
            Create sidebar block
        */
        let btn_shift_weekdays = document.createElement( "button" );
        btn_shift_weekdays.className = "btn btn-success";
        btn_shift_weekdays.innerHTML = "Swith first day";
        btn_shift_weekdays.onclick = btn_shift_handler;
        this.leap_info.className = "leap-info";
        this.leap_info.innerHTML = this.leap_info_text();
        this.days_info.className = "days-info";
        this.days_info.innerHTML = this.days_text() + " days in year";
        this.bar_div.appendChild( btn_shift_weekdays );
        this.bar_div.appendChild( this.leap_info );
        this.bar_div.appendChild( this.days_info );
    },

    update: function() {
        /*
            Update sidebar block
        */
        if( this.prev_year != current_year ) {
            this.leap_info.innerHTML = this.leap_info_text();
            this.days_info.innerHTML = this.days_text() + " days in year";
        }
    }
}

function leap_year( year ) {
    /*
        Check year is leap or not
    */
    if( year % 400 == 0 ) {
        return true;
    } else if( year % 100 == 0 ) {
        return false;
    } else if( year % 4 == 0 ) {
        return true;
    }
    return false;
}

function btn_shift_handler( ev ) {
    /*
        Button to switch first day of week (Su/Mo)
    */
    sunday_shift ? sunday_shift = false : sunday_shift = true;
    date_start = set_start_date( [ current_year, current_month, 1 ] );
    calendar.update( date_start, false, true );
}

function btn_handler( ev ) {
    /*
        Handler for month/year buttons
    */
    let month, year;
    if( ev.target.id == "month-prev" ) {
        if( ( current_month - 1 ) < 0 ) {
            current_month = 11;
            current_year -= 1;
        } else {
            current_month -= 1;
        }
    } else if( ev.target.id == "month-next" ) {
        if( ( current_month + 1 ) > 11 ) {
            current_month = 0;
            current_year += 1;
        } else {
            current_month += 1;
        }
    } else if( ev.target.id == "year-prev" ) {
            current_year -= 1;
    } else if( ev.target.id == "year-next" ) {
            current_year += 1;
    }
    date_start = set_start_date( [ current_year, current_month, 1 ] );
    calendar.update( date_start );
    sidebar.update();
}

function get_current_date() {
    /*
        Get current date, return date with first day of month as base point
    */
    let current_date = new Date();
    current_year = today_year = current_date.getFullYear();
    current_month = today_month = current_date.getMonth();
    current_day = today = current_date.getDate();
    return [ current_year, current_month, 1 ]
}

function set_start_date( [ y, m, d ] ) {
    /*
        Create start date for calendar
    */
    let cur_date = new Date( y, m, d );
    let weekday = cur_date.getDay() - sunday_shift == -1 ? 6 : cur_date.getDay() - sunday_shift;
    return [ y, m, d - weekday ];
}

function init() {
    /*
        Start point
    */
    date_source = get_current_date();
    date_start = set_start_date( date_source );
    calendar.init( date_start );
    sidebar.init( date_start );
}

window.onload = init;
