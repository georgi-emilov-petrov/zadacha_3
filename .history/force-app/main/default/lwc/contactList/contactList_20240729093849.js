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
        console.log(this.filterInput);
        console.log(this.filterField);
        if (this.filterField === "Account") {
            this.filteredContacts = this.contacts.filter((row) => {
                // console.log("row: " + JSON.stringify(row));
                // row["AccountName"].toString().includes(this.filterInput);
                try {
                    console.log("Row before filtering: " + JSON.stringify(row));
                    if (row["AccountName"] === undefined) {
                        throw new Error(
                            "AccountName key is missing in row: " +
                                JSON.stringify(row)
                        );
                    }
                    return row["AccountName"].toString().includes(
                        this.filterInput
                    );
                } catch (error) {
                    console.error(
                        "Error in filter callback for Account: " + error.message
                    );
                    return false; // Exclude rows that cause an error
                }
            });
        } else {
            this.filteredContacts = this.contacts.filter((row) =>
                row[this.filterField].toString().includes(this.filterInput)
            );
        }
        console.log(
            "filteredContacts: " + JSON.stringify(this.filteredContacts)
        );
        return this.filteredContacts;
    }

    handleFilterClear() {
        this.filteredContacts = this.contacts;
    }
}
