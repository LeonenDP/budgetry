/*
// The budgetController is going to be an immediately invoked function expression (IIFE)that will return an object
var budgetController = (function () {

    // All code inside this IIFE is in the scope of that IIFE, it's is not accessible outside the function
    // When logging "budgetController.x" it returns undefined
    var x = 23;

    // This is a private function, which causes an error if you try to access it from console.
    var add = function (a) {
        return x + a;
    };

    // This is the returned object, it will contain methods, those methods are  accessible from console.
    // logging "budgetController.publicTest(5)" returns 28 (X + 5)
    return {
    publicTest: function(b) {
        return (add(b));
    }
    }
})();


var UIController = (function () {

    // Some code
})();

// This controller module allows me to interact with the other two modules

var controller = (function (budgetCtrl, UICtrl) {

    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublicTest: function () {
            console.log(z);
        }
    }

})(budgetController, UIController);

 */

// Module 1

// BUDGET CONTROLLER
/* The budgetController is responsible of all "back end" of the app.
* it has the expense and income classes
* it has the data structure
* calculateTotal: function for calculating the totals in the data structure.
* addItem: function for adding an item to the data structure
* deleteItem: function for deleting an item from the data structure
* calculateBudget: calculates the money and percentages
* calculatePercentage : this function loops through the data.allItems.exp array, and for each item in array it calls the calcPercentage function
* getBudget: simply returns the results of calculateBudget, so `i can use it outside the IIFE scope */
var budgetController = (function () {
    // Private vars:

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // This prototype function calculate the percentage of each expense (if the totalIncome is larger than 0)
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    // This prototype returns the percentage.
    Expense.prototype.getPercentage = function () {
      return this.percentage;
    };



    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };


// This is data, it is an object, with two objects inside.
    var data = {
        allItems: {
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
    };

// Public vars:
    return {

        addItem : function (type, des, val) {
            var newItem, ID;
            /*
            // ID [1 2 3 4 5] next id :6
            // ID [1 2 4 6 8] next id: 9
            // Next id = last id +1
             */

            // Only if the array has something inside we give it a new ID, if i'ts empty, ID will be 0.
            if (data.allItems[type].length > 0) {
                // Create new ID
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem : function (type, id) {
            var ids, index;

            /* EXAMPLE */
            /* id = 6; // Let's say the id we want to remove is 6, from the ids array
               ids = [ 1, 2, 4, 6, 8]
               index = 3 // The index of id 6 is 3.;*/

            // The .map() loops over an existing array, and returns a new array containing the results of
            // calling the provided function for each element in the original array.
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1 ) {
                // .splice() is used for removing objects,
                // 1st argument is the object we start deleting from,
                // 2nd argument is the number of elements I want to delete
                data.allItems[type].splice(index, 1);
            }

        },


        calculateBudget: function() {
            // Calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');

            // Calculate the budget (income - expenses)
                data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0 ) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {

            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget : function () {
            return {
                budget :     data.budget,
                totalInc :   data.totals.inc,
                totalExp :   data.totals.exp,
                percentage : data.percentage
            }
        },

        testing: function () {
            console.log(data)
        }
    }
})();


// Module 2
// UI CONTROLLER
/* The UIController is responsible of all things that are happening in the user interface
* It has al the query selectors grouped in the DOMstrings object
* formatNumbers function
* getInput: a function that returns an object with the values of inputs
* addListItem : creates some html with the variables needed
* deleteListItem : deletes am item from the UI
* clearFields: changes the input values back to being empty, and set focus to be on the description input
* displayBudget: responsible for displaying the budget, the income label and expenses label
* getDOMstrings: returns the DOMstrings object so `i can use it outside the scope.
*/
var UIController = (function () {
    // Private vars
    var DOMstrings = {
         inputType : '.add__type',
         inputDescription : '.add__description',
         inputValue : '.add__value',
         inputBtn : '.add__btn',
         incomeContainer : '.income__list',
         expensesContainer : '.expenses__list',
         budgetLabel : '.budget__value',
         incomeLabel : '.budget__income--value',
         expensesLabel : '.budget__expenses--value',
         percentageLabel: '.budget__expenses--percentage',
         container : '.container',
         expensesPercLabel: '.item__percentage',
         dateLabel : '.budget__title--month'
    };

    var formatNumbers = function (num, type) {

        /* Rules for formatNumbers:
        * '+' or '-' before number
        * exactly two decimal points
        * comma separating thousands

        3800.5589 -> + 3,800.55
         */
        var numSplit,int,dec;

        // abs() returns the absolute value of a number
        num = Math.abs(num);
        // The toFixed() method converts a number into a STRING, keeping a specified number of decimals.
        num = num.toFixed(2);
        // Now I want to split this string, separate it to integers and decimals, so I'll use the '.' as the split point
        numSplit = num.split('.'); // It's an ARRAY now.

        // example: if num = 300.75, so numSplit = [300, 75].

        int = numSplit[0]; // (string)
        dec = numSplit[1]; // (string)

        if(int.length > 3){
            /* Methods explanations:
            // The substr() method extracts parts of a string, beginning at the character at the specified position,
            // and returns the specified number of characters.
            // THe syntax is string.substr(start, length), length is optional
            // input 33550   :   output 34,567

            // length of '34567' is 5, indexed 0-5. so I want the ',' to be left to [5-3= 2], meaning '5'
            // and after the ',' the rest of the string: from index [5-3= 2] ('5') and read 3 letters
             */
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
            // The formatNumbers returns '-' / '+' depending on if type is exp or not, plus the int var plus the dec var
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' +  dec;
    };

    var nodeListForEach = function (list, callback) {

        for ( var i = 0; i < list.length; i++) {
            callback(list[i], i); // list[i] acts as 'current' and i as 'index'
        }
    };

// Public vars:
    return {
        // 1. getInput
        getInput: function () {
            // The getInput method returns an object with all the variables.
            return {
                type : document.querySelector(DOMstrings.inputType).value, //Will be 'inc' or 'exp'
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value) // Convert string to a number here
            };
        },
        // 2. addListItem
        addListItem : function (obj, type) {
            var html, newHTML, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
             element = DOMstrings.incomeContainer;
             html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">' +
                    '<div class="item__value">%value%</div><div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>' +
                    '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // 2. Replace the placeholder text with some actual data, using replace().

                // The first parameter in replace() us the string we want to replace, and second parameter is whet to replace it with.
                // For example, I want to replace '%id%' with '%cunt%' so replace('%id%, %cunt%)

                newHTML = html.replace('%id%', obj.id);
                newHTML = newHTML.replace('%description%', obj.description);
                newHTML = newHTML.replace('%value%', formatNumbers( obj.value, type));

            //3. Insert the HTML into the DOM:

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        // 4. deleteListItem
        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            // in JS, we can remove the child of an element, so if I select some id to delete, I need to address
            // it's parent, using .parentNode
            el.parentNode.removeChild(el);
        },


        // 5. clearFields
        clearFields: function () {
            var fields, fieldsArr;
            // QuerySelectorAll returns us a list
          fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            // To convert this list to an array we'll use:
          fieldsArr = Array.prototype.slice.call(fields);

          // Now loop over each item in array, and change the value to empty
          fieldsArr.forEach(function (current, index, array) {
              current.value = "";
          });

          fieldsArr[0].focus();
        },
        // 6. displayBudget
        displayBudget: function (obj) {

            var type;
            obj.budget >=  0 ? type = 'inc': type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumbers(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumbers(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumbers(obj.totalExp, 'exp');


            if (obj.percentage > 0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        // 7. displayPercentages
        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); // This will return a list.

            // Create a function that you pass in a list, and a callback function that will be executed in a for loop


            nodeListForEach(fields, function (current, index) {

            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
            }

        })
},
        // 8. displayDate
        displayDate: function () {
            var now,months, month, year;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth(); // returns a number (0 - 11)
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        // 9. changeType
        changeType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },



        getDOMstrings : function () {
            return DOMstrings;
        },
    }
})();



// Module 3
// GLOBAL APP CONTROLLER
/* The controller is where the two other modules communicate with each other,
* there are some private functions here:
* setupEventListeners: here I define all the event listeners, for adding and deleting items
* updateBudget :       a function that uses calculateBudget,and displayBudget
* updatePercentages :  this function is for displaying the percentages
* ctrlAddItem :        this function is for adding items to the list
* ctrlDeleteItem :     this function is for delete items from the list */
var controller = (function (budgetCtrl, UICtrl) {

    // Event listeners
    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Also, add an event listener that listens to the 'ENTER' key
        document.addEventListener('keypress', function (event) {
            // 13 is the key code for the enter key
            if (event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function () {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {

      // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

      // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

      // 3. Update the UI with new percentages
        UICtrl.displayPercentages(percentages);
    };


// This functions adds the data submitted from user, it's is called from the event listeners.
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get input data
        // input is now holds an object with type, description and value
            input = UICtrl.getInput();

            // * Prevent submitting an empty input:
                // In case that the description is NOT and empty string, and also, if the value is NOT a NaN, and also larger than 0
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to UI controller
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id); // will return us the id of parent of parent of parent of parent.

        if(itemID){
            // id is 'inc-0' for example
            splitID = itemID.split('-'); // The split method will return an array ["inc", "0"]
            type = splitID[0];
            ID = parseInt(splitID[1]); // Don't forget to convert string to number

            // Function TO DO list:
                // 1. Delete the item from data structure
                budgetCtrl.deleteItem(type, ID);

                // 2. Delete the item from UI
                UICtrl.deleteListItem(itemID);

                // 3. Update and show the new budget
                updateBudget();

                 // 4. Calculate and update percentages
                updatePercentages();
        }
    };

    return {
        init : function () {
            console.log('Application has  started.');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget :     0,
                totalInc :   0,
                totalExp :   0,
                percentage : -1
            });
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();















