import { LightningElement, wire } from "lwc";
import getContacts from "@salesforce/apex/contactListController.getContacts";
import { refreshApex } from '@salesforce/apex';

export default class ContactList extends LightningElement {
    contacts = [];
    filteredContacts = [];
    sortedBy;
    sortedDirection = "asd";
    wiredContactResult;

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
}
