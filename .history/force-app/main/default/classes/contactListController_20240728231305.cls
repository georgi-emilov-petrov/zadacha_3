public with sharing class contactListController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [
            SELECT Id, Name, Phone, Email, CreatedDate, Account.Name
            FROM Contact
            ORDER BY CreatedDate DESC
        ];
    }
}