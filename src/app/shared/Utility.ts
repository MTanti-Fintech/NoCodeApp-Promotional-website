import { environment } from 'src/environments/environment';
import { isNullOrUndefined } from 'util';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import * as moment from '../../../node_modules/moment/min/moment.min.js';
const config = environment
export class Utility {
  // Ignore the naming convention for date time formats related variable

  /**
   * Local display culture. en-US.
   */
  localeDisplay = 'en-US';

  /**
   * MM/dd/yyyy Date format for display purpose.
   */
  // tslint:disable-next-line: variable-name
  dateDisplayFormat = config.DateFormat;

  /**
   * Milliseconds of one day
   */
  OneDay = 1000 * 60 * 60 * 24;

  /**
   * Date & Time display format i.e. MM/dd/yyyy HH:mm:ss.SSS
   */
  dateTimeDisplayFormat = config.DateTimeFormat;

  /**
   * yyyy-MM-dd Date format for display purpose.
   */
  // tslint:disable-next-line: variable-name
  dateDisplayFormat_yyyyMMdd = 'yyyy-MM-dd';

  /**
   * Date & Time display format i.e. yyyy-MM-dd hh:mm
   */
  // tslint:disable-next-line: variable-name
  dateTimeDisplayFormat_hhmm = 'yyyy-MM-dd hh:mm';

  /**
   * Holds current module's permission.
   */
  currentModulePermission = 0;


  isScrollShow = false;

  previousIndex: number;

  setDisplayedColumns(displayedColumns, Delete, Edit, columns) {
    let i = 0;
    columns.forEach((column, index) => {
      column.index = index;
      displayedColumns[index] = column.field;
      i = index;
    });

    if (Delete || Edit) {
      displayedColumns[i + 1] = 'action';
    }
  }

  public dragStarted(event: CdkDragStart, index: number) {
    this.previousIndex = index;
  }

  public dropListDropped(event: CdkDropList, index: number, columns) {
    if (event) {
      moveItemInArray(columns, this.previousIndex, index);
    }
  }

  changeGrid() {
    this.isScrollShow = true;
    setTimeout(() => {
      this.isScrollShow = false;
    }, 1);
  }

  /**
   * Checks if particular module has Edit or Delete permission or not.
   * @param permission Summation of permission of particular module.
   */
  
  /**
   * Convert passed date to YYYY-MM-DD format.
   * @param date Date object to be converted.
   * @returns Returns date in string if passed object has value, otherwise same object.
   */
  convertDate_YYYY_MM_DD(date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }

    return date;
  }

  convertDateTime_YYYY_MM_DD_HH_MM_SS_UTC(date) {
    try {
      if (date) {
        date = moment(date.replace('T', ' ').replace('Z', '')).format(this.dateTimeDisplayFormat);
        if (date == 'Invalid date') {
          date = null;
        }

        return date;
      } else {
        return '-';
      }
    } catch (e) {
      return '-';
    }
  }

  /**
   * Find difference in days between date range.
   * @param date1 start date.
   * @param date2 end date.
   * @returns Returns difference in days.
   */
  daysDifference(date1, date2) {
    // The number of milliseconds in one day
    // Convert both dates to milliseconds
    try {
      if (date1 && date2) {
        const date1ms = new Date(date1).getTime();
        const date2ms = new Date(date2).getTime();
        // Calculate the difference in milliseconds
        const differencems = Math.abs(date1ms - date2ms);

        // Convert back to days and return
        return Math.round(differencems / this.OneDay);
      }
      return 0;
    } catch (e) {
      console.log(e);
    }
  }
  daysDifferenceWithNegative(date1, date2) {
    // The number of milliseconds in one day
    // Convert both dates to milliseconds
    try {
      if (date1 && date2) {
        const date1ms = new Date(date1).getTime();
        const date2ms = new Date(date2).getTime();
        // Calculate the difference in milliseconds
        const differencems = date1ms - date2ms;

        // Convert back to days and return
        return Math.round(differencems / this.OneDay);
      }
      return 0;
    } catch (e) {
      console.log(e);
    }
  }


  clearSearch(state, element: HTMLInputElement) {
    if (state && element) {
      element.value = '';
      const event = new KeyboardEvent('keyup', { bubbles: true });
      document.getElementById(element.id).dispatchEvent(event);
      element.focus();
    }
  }

  /**
   * Format the supplied date to current date format.
   * @param date Supplied date to be formated.
   */
  formatDate(date) {
    return moment(date).format(this.dateDisplayFormat);
  }

  /**
   * Format the supplied date and time to current date time format.
   * @param date Supplied date time to be formated.
   */
  formatDateTime(date) {
    if (date) {
      return moment(date).format(this.dateTimeDisplayFormat);
    } else {
      return '-';
    }

  }

  convertDateTime_YYYY_MM_DD_HH_MM_SS(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }
  /**
   * A generic function which returns filter predicate for mat-table's data source.
   * This helps to search on only visible columns in grid.
   * @param displayedColumns Displayed column to be searched upon.
   */
  getFilterPredicate(displayedColumns) {
    const filterPredicate = (data, filter: string) => {
      let match = false;
      for (const column of displayedColumns) {
        match = (match || (data[column] && data[column].toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1));
      }
      return match;
    };

    return filterPredicate;
  }

  convertInvalidDateTimeToNull(date) {
    if (date && date.toString().includes('0000-00-00 00:00:00.000000')) {
      return null;
    }
    return date;
  }

  convertInvalidDateToNull(date) {
    if (date && date.toString().includes('0000-00-00')) {
      return null;
    }
    return date;
  }
  toThousandSeperated(value, maxDecimals?) {
    let numberDecimals = this.countDecimals(Number(value));
    if (maxDecimals) {
      return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
    numberDecimals = Math.max(numberDecimals, 2);
    return Number(value).toLocaleString('en-US', { minimumFractionDigits: Math.min(12, numberDecimals) });
  }
  removeThousandSeperated(value) {
    if (!isNullOrUndefined(value)) {
      return Number(value.toString().replace(/[,]*/g, ''));
    } else {
      return value;
    }
  }
  countDecimals(value) {
    if (Math.floor(value) === value) { return 0; }
    return value.toString().split('.')[1].length || 0;
  }


  /**
   * Handles the key down event with MatSelect.
   * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
   * @param {KeyboardEvent} event
   */
  _handleSelectSearchKeydown(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      // do not propagate spaces to MatSelect, as this would select the currently active option
      event.stopPropagation();
    }

  }
}
