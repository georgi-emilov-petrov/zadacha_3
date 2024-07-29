trigger CreateContactExtraInfo on Contact (after insert) {
    List<ContactExtraInfo__c> contactExtraInfoList = new List<ContactExtraInfo__c>();

    for (Contact con : Trigger.New) {
        Boolean isDateInFebruary;
        if (con.CreatedDate.month() == 2) {
            isDateInFebruary = true;
        } else {
            isDateInFebruary = false;
        }
        ContactExtraInfo__c contactExtra = new ContactExtraInfo__c(
            contactId__c = con.Id,
            contactSpecialName__c = con.LastName + con.CreatedDate,
            isSpecial__c = isDateInFebruary;
        );
        contactExtraInfoList.add(contactExtra);
    }

    if (!contactExtraInfoList.isEmpty()) {
        try {
            insert contactExtraInfoList;
        } catch (DmlException e) {
            System.debug('Error inserting ContactExtraInfo records: ' + e.getMessage());
        }
    }
}