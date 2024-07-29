import { LightningElement, wire } from "lwc";
import getContacts from "@salesforce/apex/contactListController.getContacts";
import { refreshApex } from "@salesforce/apex";

export default class ContactList extends LightningElement {
    contacts = [];
    filteredContacts = [];
    sortedBy;
    sortedDirection = "asd";
    wiredContactResult;
    filterInput;
    filterField;

    filterOptions = [
        { label: "Name", value: "Name" },
        { value: "Phone", label: "Phone" },
        { value: "Email", label: "Email" },
        { value: "Account", label: "Account" }
    ];

    columns = [
        { label: "Name", fieldName: "Name", sortable: true },
        { label: "Phone", fieldName: "Phone", sortable: true },
        { label: "Email", fieldName: "Email", sortable: true },
        {
            label: "Creation Date",
            fieldName: "CreatedDate",
            type: "date",
            sortable: true
        },
        {
            label: "Account",
            fieldName: "AccountName",
            type: "text",
            sortable: true
        }
    ];

    @wire(getContacts)
    wiredContacts(result) {
        this.wiredContactResult = result;
        const { data, error } = result;
        if (data) {
            this.contacts = data.map((contact) => ({
                ...contact,
                AccountName: contact.Account
                    ? contact.Account.Name
                    : "No Account"
            }));
            this.filteredContacts = this.contacts;
        } else if (error) {
            console.error("Error fetching contacts:", error);
        }
    }

    handleContactCreated() {
        return refreshApex(this.wiredContactResult);
    }

    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.filteredContacts];

        cloneData.sort((a, b) => {
            const aValue = a[sortedBy];
            const bValue = b[sortedBy];

            let result = 0;
            if (aValue > bValue) {
                result = 1;
            } else if (aValue < bValue) {
                result = -1;
            }

            return sortDirection === "asc" ? result : -result;
        });

        this.filteredContacts = cloneData;
        this.sortedBy = sortedBy;
        this.sortedDirection = sortDirection;
    }

    handleFilterInput(event) {
        this.filterInput = event.target.value;
    }

    handleFFChange(event) {
        this.filterField = event.detail.value;
        console.log("filterField: " + this.filterField);
    }

    handleFilterClick() {
        console.log("Filter input: " + this.filterInput);
        console.log("Filter field: " + this.filterField);

        try {
            if (this.filterField === "Account") {
                this.filteredContacts = this.contacts.filter((row) => {
                    try {
                        console.log("Row before filtering: " + JSON.stringify(row));
                        // Ensure row[AccountName] is checked for null/undefined
                        if (row.AccountName && typeof row.AccountName.toString === 'function') {
                            return row.AccountName.toString().includes(this.filterInput.toString());
                        } else {
                            console.warn("AccountName key is missing or invalid in row: " + JSON.stringify(row));
                            return false; // Exclude rows that do not meet the criteria
                        }
                    } catch (error) {
                        console.error("Error in filter callback for Account: " + error.message);
                        return false; // Exclude rows that cause an error
                    }
                });
            } else {
                this.filteredContacts = this.contacts.filter((row) => {
                    try {
                        // Ensure row[this.filterField] is checked for null/undefined
                        if (row[this.filterField] && typeof row[this.filterField].toString === 'function') {
                            return row[this.filterField].toString().includes(this.filterInput.toString());
                        } else {
                            console.warn(this.filterField + " key is missing or invalid in row: " + JSON.stringify(row));
                            return false; // Exclude rows that do not meet the criteria
                        }
                    } catch (error) {
                        console.error("Error in filter callback for " + this.filterField + ": " + error.message);
                        return false; // Exclude rows that cause an error
                    }
                });
            }

            console.log("Filtered contacts: " + JSON.stringify(this.filteredContacts));
            return this.filteredContacts;
        } catch (error) {
            console.error("Error in handleFilterClick: " + error.message);
            return [];
        }
    }

    handleFilterClear() {
        this.filteredContacts = this.contacts;
    }
}
