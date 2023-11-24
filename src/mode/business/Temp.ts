interface TempQuParam {
  id: number;
  quId: number; //题目id
  tempId: number; //模板id
  quType: number; //题目类型
  rateValue:number;//评分值
  radioValue:number;//单选值
  checkValue:[];//复选值
  inputValue:string;//输入值
}

interface TempQuParam {
     id:number;
     quId:number;
     content:string;
}
interface TempQuDetailDto extends TempQuParam{
    content:string;
    answerList:TempQuParam[]
}

export default TempQuDetailDto;


