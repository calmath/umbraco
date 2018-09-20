//=include components/accordions/_accordion.js
//=include components/accordions/_linkToAccordion.js
/* globals LinkToAccordion */

var allAccordionElems = document.querySelectorAll(".accordions");
for(var i = 0; i < allAccordionElems.length; i++){
	
	var accordElem = allAccordionElems[i];
	if(i === 0){
		new LinkToAccordion(accordElem);
	}else{
		new LinkToAccordion(accordElem, {
			"keepOpen" : true,
			"animate" : true,
			"allOpen" : false,
			"firstOpen" : true
			}
		);
	}
	
}