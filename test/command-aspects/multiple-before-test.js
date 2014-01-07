describe("Multiple @Before execution testing", function() {

	var provider;
	var interceptor1Executed = false;
	var interceptor2Executed = false;
	var commandExecutedAfter = false;

	beforeEach(function() {

		commangular.reset();
		
		commangular.aspect('@Before(/com\.test1.*/)', function(){

			return {

				execute : function() {
							
					interceptor1Executed = true;
				}
			}
			
		},1);
		
		commangular.aspect('@Before(/com\.test1.*/)', function(processor){
			
			return {

				execute : function() {
									
					expect(interceptor1Executed).toBe(true);
					interceptor2Executed = true;
				}
			}
			
		},2);

		
		commangular.create('com.test1.Command1',function(){

			return {

				execute : function() {
										
					expect(interceptor1Executed).toBe(true);
					expect(interceptor2Executed).toBe(true);
					commandExecutedAfter = true;
					
				}
			};
		});

		commangular.create('com.test2.Command2',function(){

			return {

				execute : function() {
										
					expect(interceptor1Executed).toBe(true);
					expect(interceptor2Executed).toBe(true);
					expect(commandExecutedAfter).toBe(true);

				}
			};
		});
	
	});

	beforeEach(function() {

		module('commangular', function($commangularProvider) {
			provider = $commangularProvider;
		});
		inject();
	});

	it("provider should be defined", function() {

		expect(provider).toBeDefined();
	});

	it("should execute the interceptor before the command", function() {
	
		provider.mapTo('BeforeTestEvent').asSequence().add('com.test1.Command1').add('com.test2.Command2');
		dispatch({event:'BeforeTestEvent'},function(){

			expect(interceptor1Executed).toBe(true);
			expect(interceptor2Executed).toBe(true);
			expect(commandExecutedAfter).toBe(true);
		});
	});
});