declare namespace Essential.Person {

  interface Schema extends XC.Data.NamedData {
    /*别名(曾用名)*/
    alias?: string;
    /*出生日期*/
    birthday?: string;
    /*文化程度*/
    education?: string;
    /*民族*/
    ethnicity?: string;
    /*性别*/
    gender?: string;
    /*健康状况*/
    health?: string;
    /*身份证号*/
    idCardCode?: string;
    /*婚姻状况*/
    marriage?: string;
    /*户籍地址*/
    nativeAddress?: string;
    /*户籍地行政区划 行政区划ID*/
    nativeDistrict?: string;
    /*政治面貌*/
    partyAffiliation?: string;
    /*联系电话*/
    phoneNumber?: string;
  }

  type PageParams = Pro.Table.PageParams & Essential.Person.Schema & {
    birthBefore?: string;
    birthAfter?: string;
  }
}
