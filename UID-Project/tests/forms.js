const puppeteer = require('puppeteer'),
	  faker = require('faker'),
	  fs = require('fs'),
	  assert = require('assert');

faker.locale = "en_GB";

const  testForms = [
		  {
			  "url" : "http://access2work.local/get-involved/participant-referral-form/",
			  "inputs" : [
				  {
					  "type" : "text",
					  "elem" : "input",
					  "name" : "6f381b24-6da4-4c7e-f707-81350c7478ff",
					  "desc" : "Name",
					  "value" : faker.name.findName()
				  },{
					  "type" : "text",
					  "elem" : "input",
					  "name" : "2e070498-ceac-47a4-eeac-1531eea0db1d",
					  "desc" : "Occupation",
					  "value" : faker.name.jobTitle()
				  },{
					  "type" : "text",
					  "elem" : "input",
					  "name" : "761d851e-dfce-440a-d848-3586abeeca87",
					  "desc" : "Where did you hear about us?",
					  "value" : faker.lorem.words()
				  },{
					  "type" : "text",
					  "elem" : "input",
					  "name" : "84742cb8-777e-4884-b104-80a68207a359",
					  "desc" : "Postcode",
					  "value" : faker.address.zipCode()
				  },{
					  "type" : "select",
					  "elem" : "select",
					  "name" : "2b35d6af-2cbd-4a57-c2a5-19803278c33a",
					  "desc" : "Contact you",
					  "value" : ["Email", "Phone", "Text"],
					  "dependent" : {
						  "Email" : {
							  "elem" : "input",
							  "name" : "26bc113f-a9d6-4a82-d1bb-7c72c321fee7",
							  "desc" : "Email address",
							  "value" : faker.internet.email()
						  },
						  "Phone" : {
							  "elem" : "input",
							  "name" : "d6ea9001-4682-4b45-b870-e6263db643bc",
							  "desc" : "Phone number",
							  "value" : faker.phone.phoneNumber().replace(/\s/g, "")
						  },
						  "Text" : {
							  "elem" : "input",
							  "name" : "d6ea9001-4682-4b45-b870-e6263db643bc",
							  "desc" : "Phone number",
							  "value" : faker.phone.phoneNumber().replace(/\s/g, "")
						  }
					  }
				  },{
					  "type" : "checkboxGroup",
					  "elem" : "label",
					  "name" : [
						  "00fd384c-1575-41b2-eb3f-9de7dc3b23c4_0",
						  "00fd384c-1575-41b2-eb3f-9de7dc3b23c4_1",
						  "00fd384c-1575-41b2-eb3f-9de7dc3b23c4_2",
						  "00fd384c-1575-41b2-eb3f-9de7dc3b23c4_3",
						  "00fd384c-1575-41b2-eb3f-9de7dc3b23c4_4",
						  "00fd384c-1575-41b2-eb3f-9de7dc3b23c4_5",
						  "00fd384c-1575-41b2-eb3f-9de7dc3b23c4_6"
					  ],
					  "desc" : "When does it suit for us to get in touch?",
					  "min" : 2,
					  "max" : 7
				  },{
					  "type" : "checkbox",
					  "elem" : "label",
					  "name" : "72bd28e5-fd60-4a4e-df7c-93db4847f7e5",
					  "desc" : "Tick this box to confirm",
					  "required" : true
				  },{
					  "type" : "checkboxGroup",
					  "elem" : "label",
					  "name" : [
						  "04cac01b-5e21-40d8-90fa-6353227d215f_0",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_1",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_2",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_3",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_4",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_5",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_6",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_7",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_8",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_9",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_10",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_11",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_12",
						  "04cac01b-5e21-40d8-90fa-6353227d215f_13"
					  ],
					  "desc" : "Tick the conditions(s) that you can most identify with",
					  "min" : 1,
					  "max" : 10,
					  "dependent" : {
						  "04cac01b-5e21-40d8-90fa-6353227d215f_13" : {
							  "elem" : "input",
							  "name" : "1e698be9-ab3e-41f5-872c-587d2fd48a02",
							  "desc" : "Other",
							  "value" : faker.internet.email()
						  }
					  }
				  },{
					  "type" : "checkbox",
					  "elem" : "label",
					  "name" : "df96f8f9-ffa1-4c89-d1b7-00bbf0ae4c9a",
					  "desc" : "Tick this box to confirm",
					  "required" : true
				  }
			  ],
			  "submit" : {
				  "button" : {
					  "elem" : "input",
					  "name" : "__next"
				  },
				  "shouldSubmit" : true,
				  "accepted" : {
					  "class" : "umbraco-forms-submitmessage",
					  "message" : "Thank you"
				  }
			  }
		  }
	  ],
	  viewPorts = [
		  {
			  width: 320,
			  height: 440
		  }
	  ];


var formsTested = 0;

function formTest(){
	describe('Test Forms', function() {
	
		this.timeout(60000);

		var testForm = testForms[formsTested];
		var fieldCount = 0;
		var _page = null;

		it('Open webpage', (done) => {

			this.timeout(30000);

			puppeteer.launch().then((browser) => {
			//puppeteer.launch({headless: false}).then((browser) => {

				browser.newPage().then((page) => {

					const url = testForm.url;
					page.setViewport(viewPorts[0]);

					page.goto(url, {waitUntil: 'networkidle2'}).then((resp) => {
						//console.log(resp);

						page.click('button[class="button prime"]').then(()=>{

							_page = page;
							assert.ok(true, 'page has loaded');
							done();

						}).catch(err => {
							console.log(err);
							assert.ok(false);
						});

					}).catch((err) => {
						console.log(err);
						assert.ok(false);
					});

				}).catch((err) => {
					console.log(err);
					assert.ok(false);
				});

			}).catch((err) => {
				console.log(err);
				assert.ok(false);
			});
		});

		it('Fill in form', (done) => {

			this.timeout(60000);

			fillInForm(_page, (page, err) => {

				try {
					if(err){
						assert.ok(false, 'error filling in form');
					}else{
						assert.ok(true, 'form has been filled in');
					}
				} catch (e) {
					takeScreenShot(page, "filled_in_error");
					return done(e);
				}
				takeScreenShot(page, "filled_in_success").then(() => {
					done();
				}).catch(err => {
					done();
				});

			});

		});

		it('Submit form', (done) => {

			this.timeout(60000);

			var attribute = attributeName(testForm.submit.button);

			_page.click(attribute).then(() => {

				var className = testForm.submit.accepted.class;

				console.log(`div[class="${className}"]`);

				_page.waitForNavigation({"waitUntil" : "networkidle0"}).then(() => {

					_page.waitForSelector(`div[class="${className}"]`).then(() => {

						console.log(`.${className}`);
						_page.evaluate((className) => { 
							console.log(className);
							var divElem = document.querySelector(`.${className}`);
							while(divElem == null){
								divElem = document.querySelector(`.${className}`);
							}
							console.log(divElem);
							return divElem.textContent;
						}, className).then((text) => {
							if(text.indexOf(testForm.submit.accepted.message) > -1){
								assert.ok(true, 'submitted');
							}else{
								assert.ok(false, 'check output message');
							}

							takeScreenShot(_page, "submission").then(() => {
								done();
							}).catch(err => {
								console.log(err);
								done();
							});

						}).catch(err => {
							console.log(err);
						});


					}).catch((err) => {

						console.log(err);

					});

				}).catch(err => {
					console.log(err);
				});



			}).catch(err => {

				console.log(err);

			});

		});

		function takeScreenShot(page, title){

			return new Promise((resolve, reject) => {

				var ssPath = [
					'UID-project',
					'tests',
					'results',
					'forms'
				];
				var fullPath = './';
				for(let dir of ssPath){
					fullPath += dir + '/';
					if(!fs.existsSync(fullPath)){
						fs.mkdirSync(fullPath);
					}
				}

				var ssOptions = {
					"path" : `./${ssPath.join('/')}/${title}.jpg`,
					"type" : "jpeg",
					"fullPage" : true
				}
				page.screenshot(ssOptions).then(resp => {
					resolve(resp);
				}).catch(err => {
					reject(err);
				});

			});


		}


		function setValueForField(page, attribute, value){

			return new Promise((resolve, reject) => {
				page.type(attribute, value).then(() => {

					resolve();

				}).catch(err => {
					reject(err);
				});
			});


		}

		function attributeName(input){
			return `${input["elem"]}[${ input["elem"] == "label" ? "for" : "name" }="${ Array.isArray(input["name"]) ? input["name"][0] : input["name"]}"]`;
		}


		function fillInField(page, count){

			return new Promise((resolve, reject) => {

				var inputs = testForm.inputs;
				var input = inputs[count];
				var attribute = attributeName(input);
				var value = input.value;
				if(Array.isArray(value)){
					var randomValue = Math.ceil(Math.random() * value.length) - 1;
					value = value[randomValue];
				}

				page.waitForSelector(attribute).then(() => {

					switch(input.type){
						case "text" :
							page.click(attribute).then(() => {

								setValueForField(page, attribute, value).then(() => {

									//assert(true, `value set for ${input.desc}`);
									resolve();

								}).catch(err => {
									//assert(false, `couldn't set value for ${input.desc}`);
									reject(err);
								});

							}).catch(err => {
								//assert(false, `can't click on element ${attribute}`);
								reject(err);
							});
						break;
						case "checkboxGroup" :

							var numberOfItemsToClick = input.min + (Math.ceil(Math.random() * (input.max - input.min)) - 1);
							var labelsToClick = [];
							resolve();
							while(labelsToClick.length < numberOfItemsToClick){

								var addName = input.name[Math.ceil(Math.random() * input.name.length) - 1];
								if(labelsToClick.indexOf(addName) == -1){
									labelsToClick.push(addName);
								}

							}
							var tickCount = 0;

							function labelClickAction(){

								var id = labelsToClick[tickCount];
								var checkAttribute = `label[for="${id}"]`;
								page.click(checkAttribute).then(() => {

									var shouldTick = false;
									if(input.dependent){
										if(input.dependent[id]){

											var dependInput = input.dependent[id];
											attribute = `${dependInput["elem"]}[name="${dependInput["name"]}"]`;
											value = dependInput.value;

											page.waitForSelector(attribute).then(() => {
												page.click(attribute).then(() => {

													setValueForField(page, attribute, value).then(() => {

														tickCount++;
														if(tickCount == labelsToClick.length){
															resolve();
														}else{
															labelClickAction().bind(this);
														}

													}).catch((err) => {
														reject(err);
													});
												}).catch((err) => {
													reject(err);
												});
											}).catch((err) => {
												reject(err);
											});

										}else{
											shouldTick = true;
										}
									}else{
										shouldTick = true;
									}

									if(shouldTick){
										tickCount++;
										if(tickCount == labelsToClick.length){
											resolve();
										}else{
											labelClickAction().bind(this);
										}
									}


								}).catch(err => {
									reject(err);
								});

							}
							labelClickAction().bind(this);


						break;
						case "checkbox" :

							var shouldClick = true;
							if(input.required === false){

								shouldClick = Math.round() >= 0.5 ? true : false;

							}

							if(shouldClick){

								page.click(attribute).then(() => {
									takeScreenShot(page, `checbox_${input.name}`).then(() => {
										resolve();
									}).catch(err => {
										reject(err);
									});

								}).catch(err => {
									reject(err);
								});

							}else{
								resolve();
							}

						break;
						case "select" :

							page.select(attribute, value).then(() => {

								//assert(true, `value set for ${input.desc}`);

								if(input.dependent){

									var dependInput = input.dependent[value];
									attribute = `${dependInput["elem"]}[name="${dependInput["name"]}"]`;
									value = dependInput.value;

									page.waitForSelector(attribute).then(() => {
										page.click(attribute).then(() => {
											setValueForField(page, attribute, value).then(() => {

												//assert(true, `value set for ${dependInput.desc}`);
												resolve();

											}).catch((err) => {
												//assert(false, `can'tset value for field ${attribute}`);
												reject(err);
											});
										}).catch((err) => {
											//assert(false, `can't click on dependent element ${attribute}`);
											reject(err);
										});
									}).catch((err) => {
										//assert(false, `can't wait on dependent element ${attribute}`);
										reject(err);
									});
								}else{
									resolve();
								}

							}).catch(err => {
								reject(err);
							});

						break;

						default :
							reject('No identifiable element');
						break;
						}

				}).catch(err => {
					//assert(false, 'not waiting for element');
					reject(err);
				});
			});

		}

		function fillInForm(page, callback){

			fillInField(page, fieldCount).then( () => {
				fieldCount++;
				if(fieldCount == testForm.inputs.length){
					callback(page, null);
				}else{
					fillInForm(page, callback);
				}
			}).catch( err => {
				callback(page, err);
			});

		}

	});
}

formTest();