exports.uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
  
exports.buildBasicInfoProps = (params) => {
    return {
        props: {
        'lastName': params.lastName || "",
        'nickName': params.nickName  || "",
        'companyName': params.companyName || "",
        'birthDate': params.birthDate || "",
        'titleCode': params.titleCode || "",
        'birthPlace': params.birthPlace || "",
        'firstName': params.firstName || "",
        'number': params.number || "",
        'nationalityCode': params.nationalityCode || "",
        'genderCode': params.genderCode || "",
        'classificationCode': params.classificationCode || "",
        'civilStatusCode': params.civilStatusCode || "",
        'profileTypeCode': params.profileTypeCode || "",
        'middleName': params.middleName || "",
        'effectiveDate': params.effectiveDates || "",
        'suffixCode': params.suffixCode || "",
        'hash': this.uuidv4()
        }
    }
}