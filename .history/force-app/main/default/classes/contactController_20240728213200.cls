public with sharing class contactController {
    @AuraEnabled
    public static List<Account> getAccounts(){
        return [SELECT Id, Name FROM Account];
    }
}