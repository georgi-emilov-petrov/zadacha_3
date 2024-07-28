import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/NewContactController.getAccounts';

export default class ContactForm extends LightningElement {
    name = '';
    email = '';
    phone = '';
    selectedAccount = '';
    accountOptions = [];

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accountOptions = data.map((account) => ({
                label: account.Name,
                value: account.Id
            }));
        } else if (error) {
            console.error('Error fetching accounts:', error);
        }
    }



}