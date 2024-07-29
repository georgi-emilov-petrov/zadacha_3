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
        console.log(this.filterField);

        const filterInputLower = this.filterInput
        ? this.filterInput.toLowerCase()
        : "";
        console.log("filterInput.toLowerCase(): " + this.filterInput);

        if (!filterInputLower) {
            this.filteredContacts = this.contacts;
            console.log("No filter input, displaying all contacts.");
            return this.filteredContacts;
        }

        if (this.filterField === "Account") {
            this.filteredContacts = this.contacts.filter((row) => {
                console.log("row: " + JSON.stringify(row));
                const accountName = row.AccountName
                    ? row.AccountName.toLowerCase()
                    : "";
                console.log("accountName: " + accountName);
                accountName.includes(filterInputLower);
            });
        } else {
            this.filteredContacts = this.contacts.filter((row) => {
                const fieldValue = row[this.filterField]
                    ? row[this.filterField].toLowerCase()
                    : "";
                console.log("fieldValue: " + fieldValue);
                fieldValue.includes(filterInputLower);
            });
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
