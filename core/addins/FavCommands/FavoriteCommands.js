﻿//engine: JScript
//uname: FavoriteCommands
//dname: Избранные команды
//addin: global
//addin: stdlib
//addin: stdcommands
//addin: macroswnd
//help: inplace
//author: alonehobo
//www: https://snegopat.ru/forum/viewtopic.php?f=3&t=651

/*@
Скрипт создает форму, на которой можно настроить вызов макросов снегопата и
использовать её как панель инструментов.
@*/

stdlib.require("TextWindow.js",SelfScript);

global.connectGlobals(SelfScript);
var extsearch = addins.byUniqueName("ExtendedSearch");
var funcproc = addins.byUniqueName("funcprocpanel");

function getFavoriteCommands(){
if (!FavoriteCommands._instance)
        new FavoriteCommands();
    
    return FavoriteCommands._instance;
 }
 
function start(){
	f = getFavoriteCommands();
	f.OpenWindow = true;
	if (!f.form.Открыта())
	f.form.Open();	
	f.update()
}

SelfScript.self['macrosОткрыть окно'] = function() {
	start()
}

function FavoriteCommands(){
	FavoriteCommands._instance = this;
	var pathToForm = SelfScript.fullPath.replace(/js$/, 'ssf');
	this.form = loadScriptForm(pathToForm, this);
	this.OpenWindow = false;
}

FavoriteCommands.prototype.update = function(){
	if (!this.OpenWindow) return;
	ОбщиеКартинки = Метаданные.ОбщиеКартинки;
	КПКнопки = this.form.ЭлементыФормы.КП.Кнопки;
	Действие = this.form.ЭлементыФормы.КПСлужебная.Кнопки.СлужебнаяКнопка.Действие;
	for (i=КПКнопки.Количество()-1; i>1;i--)
		КПКнопки.Удалить(i);
	for (i=0; i<мНаборКнопок.Количество();i++)
	{
	ТекСтрока = мНаборКнопок.Получить(i);
	if (!ТекСтрока.ИмяСкрипта) 
		НоваяКнопка = КПКнопки.Добавить("Разделитель" + i, ТипКнопкиКоманднойПанели.Разделитель); 
	else {
		НоваяКнопка = КПКнопки.Добавить(ТекСтрока.ИмяСкрипта + "__" + i, ТипКнопкиКоманднойПанели.Действие, ТекСтрока.ИмяМакроса, Действие); 
		НоваяКнопка.Подсказка = ТекСтрока.Подсказка;
		if (ТекСтрока.Картинка)
			try{
				НоваяКнопка.Картинка = БиблиотекаКартинок[ТекСтрока.Картинка]}catch(e){}
			try{	
				НоваяКнопка.Картинка = ОбщиеКартинки.Найти(ТекСтрока.Картинка).Картинка}catch(e){}
	
	}
	}
}

FavoriteCommands.prototype.ВызовКоманды = function (Кнопка) {
	ПараметрыКоманды = Кнопка.val;
	
	var ИмяСкрипта = ПараметрыКоманды.Имя;
	ИмяСкрипта = ИмяСкрипта.substr(0, ИмяСкрипта.indexOf("__"));
	addins.byUniqueName(ИмяСкрипта).invokeMacros(ПараметрыКоманды.Текст);
}

FavoriteCommands.prototype.КПОткрытьНастройки = function (Кнопка) {
	var pathToForm=SelfScript.fullPath.replace(/.js$/, 'param.ssf')
    мФормаНастройки=loadScriptForm(pathToForm, SelfScript.self) 
	мФормаНастройки.НаборКнопок = мНаборКнопок.Скопировать();
	мФормаНастройки.Автозапуск = мАвтозапуск;
    мФормаНастройки.ОткрытьМодально()
}

////////////////////////////////////////////////////////////////////////////////////////
//{Форма настроек

function НаборКнопокИмяСкриптаНачалоВыбора(Элемент, СтандартнаяОбработка){
	СтандартнаяОбработка.val = false;
	macros = macroswnd.MacrosWnd().selectMacros();
	if(!macros)
		return;
	ТекСтрока = мФормаНастройки.ЭлементыФормы.НаборКнопок.ТекущаяСтрока;
	ТекСтрока.ИмяСкрипта = macros.addin;
	ТекСтрока.ИмяМакроса = macros.macros;
	ТекСтрока.Подсказка = ТекСтрока.ИмяМакроса;
}

function мЗаписатьНастройки(){

    мАвтозапуск = мФормаНастройки.Автозапуск;
    мНаборКнопок = мФормаНастройки.НаборКнопок.Скопировать();
	    
    profileRoot.setValue(pflFavoriteCommandsOpenOnStart, мАвтозапуск)
    profileRoot.setValue(pflFavoriteCommandsTab, мНаборКнопок)
	
	start();
	
}

function НаборКнопокКартинкаНачалоВыбора(Элемент, СтандартнаяОбработка){
	СтандартнаяОбработка.val = false;
	ТекКартинка = Элемент.val.Значение;
	if(ТекКартинка){
		ТекСтрока = мФормаВыборкаКартинки.НаборКартинокВыбор.Найти(ТекКартинка);
		if (ТекСтрока)
			мФормаВыборкаКартинки.ЭлементыФормы.НаборКартинокВыбор.ТекущаяСтрока = ТекСтрока;}
    Картинка = мФормаВыборкаКартинки.ОткрытьМодально()
	if (Картинка)
	Элемент.val.Значение = Картинка;
}

function searchicons(text){
	
	мФормаВыборкаКартинки.НаборКартинокВыбор = СформироватьТзКартинок();
	if (!text) return
	
	ТабКартинок = мФормаВыборкаКартинки.НаборКартинокВыбор;
	for(Сч=ТабКартинок.Количество()-1; Сч>=0; Сч--){
		Строка = ТабКартинок.Получить(Сч);
		if (!(Строка.Картинка.toLowerCase().indexOf(text.toLowerCase())+1))
			ТабКартинок.Удалить(Строка)	
	}	
}

function СтрокаПоискаОкончаниеВводаТекста(Элемент, Текст, Значение, СтандартнаяОбработка){	
		text = Текст.val;
		searchicons(text);	
}

function СтрокаПоискаОчистка(Элемент, СтандартнаяОбработка){	
		мФормаВыборкаКартинки.НаборКартинокВыбор = СформироватьТзКартинок();
}

function СтрокаПоискаАвтоПодборТекста(Элемент, Текст, ТекстАвтоПодбора, СтандартнаяОбработка){	
		text = Текст.val;
		searchicons(text);	
}

function НаборКартинокВыборВыбор(Элемент, ВыбраннаяСтрока, Колонка, СтандартнаяОбработка){
	СтандартнаяОбработка.val = false;
	мФормаВыборкаКартинки.Закрыть(ВыбраннаяСтрока.val.Картинка);
}

function НаборКнопокПриВыводеСтроки (Элемент, ОформлениеСтроки, ДанныеСтроки){	
	var cell = ОформлениеСтроки.val.Ячейки.Картинка;
	var TypePicture = v8New("Картинка");
	
	if (!ДанныеСтроки.val.Картинка) 
		return;
		
	TypePicture = БиблиотекаКартинок[ДанныеСтроки.val.Картинка];
		
    try{cell.УстановитьКартинку(TypePicture)}catch(e){}
}

function НаборКартинокВыборПриВыводеСтроки (Элемент, ОформлениеСтроки, ДанныеСтроки){	
	var cell = ОформлениеСтроки.val.Ячейки.Картинка;
	var TypePicture = v8New("Картинка");
	
	if (!ДанныеСтроки.val.Картинка) 
		return;
		
	TypePicture = БиблиотекаКартинок[ДанныеСтроки.val.Картинка];
		
    try{cell.УстановитьКартинку(TypePicture)}catch(e){}
}

function КпШапкаЗаписатьИЗакрыть(Кнопка) {
    мЗаписатьНастройки()
    мФормаНастройки.Закрыть()
}

function КпШапкаЗаписать(Кнопка) {
    мЗаписатьНастройки()
}

function НастройкиПриОткрытии() {
    мФормаНастройки.Автозапуск=мАвтозапуск;
    мФормаНастройки.ГруппыЗакладок = мНаборКнопок.Скопировать();
}

function СформироватьТзПоУмолчанию() {

    var ТЗ = v8New("ТаблицаЗначений");
    ТЗ.Колонки.Добавить("ИмяСкрипта");
	ТЗ.Колонки.Добавить("ИмяМакроса");
	ТЗ.Колонки.Добавить("Подсказка");
	ТЗ.Колонки.Добавить("Картинка");
	
	function ДобавитьСтроку(ТЗ, ИмяСкрипта, ИмяМакроса, Подсказка, Картинка){
		НоваяСтрока = ТЗ.Добавить();
		НоваяСтрока.ИмяСкрипта = ИмяСкрипта;
		НоваяСтрока.ИмяМакроса = ИмяМакроса;
		НоваяСтрока.Подсказка = Подсказка;
		НоваяСтрока.Картинка = Картинка;
    }
	
	ДобавитьСтроку(ТЗ, "funcprocpanel", "Открыть окно", "Панель функций", "ОтборПоВиду");
	ДобавитьСтроку(ТЗ, "", "", "", "");
	ДобавитьСтроку(ТЗ, "mdNavigator", "Открыть объект метаданных", "Навигатор метаданных", "НайтиВСодержании");
	
    return ТЗ;
}

function РазложитьСтрокуВМассивПодстрок(Стр){
	
	Разделитель = ",";
	
	var ТабКартинок = v8New("ТаблицаЗначений");
	ТабКартинок.Колонки.Добавить("Картинка");
	ТабКартинок.Колонки.Добавить("Хранилище");
	
	ДлинаРазделителя = 1;
		while (true) {
			Поз = Стр.indexOf(Разделитель)+1;
			if (Поз==0){
				НоваяСтрока = ТабКартинок.Добавить();
				НоваяСтрока.Картинка = Стр;
				НоваяСтрока.Хранилище = "БиблиотекаКартинок";
				return ТабКартинок;
			};
			НоваяСтрока = ТабКартинок.Добавить();
			НоваяСтрока.Картинка = Стр.substr(0,Поз-1);
			НоваяСтрока.Хранилище = "БиблиотекаКартинок";
			Стр = Стр.substr(Поз,Стр.length);
			};
}	


function СформироватьТзКартинок() {

	//БиблиотекаКартинок
	var СтрокаКартинок = "АктивироватьЗадачу,АктивныеПользователи,БизнесПроцесс,БизнесПроцессОбъект,ВводНаОсновании,ВидРасчета,ВнешнийИсточникДанных,ВнешнийИсточникДанныхТаблица,ВосстановитьЗначения,Вперед,ВыборКомпоновкиДанных,ВыборКомпоновкиДанныхНедоступный,Выбрать,ВыбратьВерхнийУровень,ВыбратьЗначение,ВыбратьИзСписка,ВыбратьТип,ВывестиСписок,ВыполнитьЗадачу,ГеографическаяСхема,ГрафическаяСхема,Дебет,ДебетКредит,Дендрограмма,Диаграмма,ДиаграммаГанта,ДобавитьВИзбранное,ДобавитьЭлементСписка,Документ,ДокументОбъект,ЖурналДокументов,ЖурналРегистрации,ЖурналРегистрацииПоПользователю,ЗагрузитьНастройкиОтчета,Задача,ЗадачаОбъект,ЗакончитьРедактирование,Закрыть,Заменить,Записать,ЗаписатьИЗакрыть,ЗаписатьИзменения,ЗатенитьФлажки,ЗафиксироватьТаблицу,ИерархическийПросмотр,Изменить,ИзменитьФорму,ИзменитьЭлементСписка,ИсторияОтборов,Календарь,Калькулятор,Картинка,Константа,КонструкторЗапроса,КонструкторНастроекКомпоновкиДанных,Кредит,КритерийОтбора,Лупа,Назад,Найти,НайтиВДереве,НайтиВСодержании,НайтиВСписке,НайтиПоНомеру,НайтиПредыдущий,НайтиСледующий,НастроитьСписок,НастройкаСписка,НастройкиОтчета,НоваяВложеннаяСхемаКомпоновкиДанных,НоваяГруппа,НоваяГруппировкаКомпоновкиДанных,НоваяДиаграммаКомпоновкиДанных,НоваяТаблицаКомпоновкиДанных,НовоеОкно,Обновить,Обработка,Остановить,ОтборИСортировка,ОтборКомпоновкиДанных,ОтборКомпоновкиДанныхНедоступный,ОтборПоВиду,ОтборПоТекущемуЗначению,ОтключитьОтбор,ОткрытьФайл,ОтменаПроведения,ОтменитьПоиск,Отчет,Очистить,ПараметрыВыводаКомпоновкиДанных,ПараметрыВыводаКомпоновкиДанныхНедоступные,ПараметрыДанныхКомпоновкиДанных,ПерейтиПоНавигационнойСсылке,ПереключитьАктивность,ПереместитьВверх,ПереместитьВлево,ПереместитьВниз,ПереместитьВправо,ПеренестиЭлемент,Перечисление,Перечитать,Печать,ПечатьСразу,ПланВидовРасчета,ПланВидовРасчетаОбъект,ПланВидовХарактеристик,ПланВидовХарактеристикОбъект,ПланОбмена,ПланОбменаОбъект,ПланСчетов,ПланСчетовОбъект,ПоказатьДанные,ПолучитьНавигационнуюСсылку,Пользователь,ПользовательБезНеобходимыхСвойств,ПользовательСАутентификацией,ПользовательскиеПоляКомпоновкиДанных,ПоляГруппировкиКомпоновкиДанных,ПоляГруппировкиКомпоновкиДанныхНедоступные,ПометитьНаУдаление,ПорядокКомпоновкиДанных,ПорядокКомпоновкиДанныхНедоступный,Предыдущий,Провести,ПросмотрПоВладельцу,ПрочитатьИзменения,РазвернутьВсе,РегистрБухгалтерии,РегистрНакопления,РегистрРасчета,РегистрСведений,РегистрСведенийЗапись,РегламентноеЗадание,РегламентныеЗадания,РедактироватьВДиалоге,РежимПросмотраСписка,РежимПросмотраСпискаДерево,РежимПросмотраСпискаИерархическийСписок,РежимПросмотраСпискаСписок,СвернутьВсе,СводнаяДиаграмма,Свойства,Символ,СинтаксическийКонтроль,СкопироватьОбъект,СкопироватьЭлементСписка,Следующий,СнятьФлажки,СоздатьГруппу,СоздатьНачальныйОбраз,СоздатьЭлементСписка,СортироватьСписок,СортироватьСписокПоВозрастанию,СортироватьСписокПоУбыванию,Сортировка,СохранитьЗначения,СохранитьНастройкиОтчета,СохранитьФайл,Справка,Справочник,СправочникОбъект,СтандартнаяНастройкаКомпоновкиДанных,СтартБизнесПроцесса,СформироватьОтчет,ТабличныйДокументВставитьПримечание,ТабличныйДокументВставитьРазрывСтраницы,ТабличныйДокументОтображатьГруппировки,ТабличныйДокументОтображатьЗаголовки,ТабличныйДокументОтображатьПримечания,ТабличныйДокументОтображатьСетку,ТабличныйДокументТолькоПросмотр,ТабличныйДокументУдалитьПримечание,ТабличныйДокументУдалитьРазрывСтраницы,Удалить,УдалитьНепосредственно,УдалитьЭлементСписка,УдалитьЭлементСпискаНепосредственно,УровеньВверх,УровеньВниз,УсловноеОформлениеКомпоновкиДанных,УсловноеОформлениеКомпоновкиДанныхНедоступное,УстановитьВремя,УстановитьИнтервал,УстановитьПометкуУдаленияЭлементаСписка,УстановитьФлажки,Форма,ХранилищеНастроек";
    ТабКартинок = РазложитьСтрокуВМассивПодстрок(СтрокаКартинок);
	
	//Общие картинки
	ОбщиеКартинки = Метаданные.ОбщиеКартинки;
	for(i=0;i<ОбщиеКартинки.Количество();i++){
		НоваяСтрока = ТабКартинок.Добавить();
		НоваяСтрока.Картинка = ОбщиеКартинки.Получить(i).Имя;
		НоваяСтрока.Хранилище = "ОбщиеКартинки";
	}

    return ТабКартинок;
}
//}


////////////////////////////////////////////////////////////////////////////////////////
////{ Инициализация скрипта
////
var pflFavoriteCommandsOpenOnStart  = "FavoriteCommands/OpenOnStart"
var pflFavoriteCommandsTab     = "FavoriteCommands/Tab"


// Восстановим настройки
profileRoot.createValue(pflFavoriteCommandsOpenOnStart, false, pflSnegopat)
profileRoot.createValue(pflFavoriteCommandsTab, СформироватьТзПоУмолчанию(), pflSnegopat)

мФормаНастройки = null
var мАвтозапуск = profileRoot.getValue(pflFavoriteCommandsOpenOnStart)
var мНаборКнопок = profileRoot.getValue(pflFavoriteCommandsTab)
var pathToForm=SelfScript.fullPath.replace(/.js$/, 'paramico.ssf')
    мФормаВыборкаКартинки=loadScriptForm(pathToForm, SelfScript.self) 
	мФормаВыборкаКартинки.НаборКартинокВыбор = СформироватьТзКартинок().Скопировать();
//}

if(мАвтозапуск==true) 
	start();
