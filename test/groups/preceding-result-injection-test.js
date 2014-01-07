describe("Injection from preceding command result test", function() {

	var provider;
	var eventName = 'TestEvent';
	var resultInjected;

	beforeEach(function() {

		commangular.reset();
		commangular.create('Command1', function() {

			return {

				execute: function($log) {

					$log.log('logging');
					return 25;

				}
			};
		}, {resultKey: 'commandResult'});

		commangular.create('Command2', function() {

			return {

				execute: function(commandResult, $log) {

					$log.log(commandResult);
					resultInjected = commandResult;


				}
			};
		});
	});

	beforeEach(function() {

		module('commangular', function($commangularProvider) {

			provider = $commangularProvider;

		});
		inject(function($commangular, $rootScope, $injector) {

			injector = $injector;
		});
	});

	it('command should be executed and resultInjected has to be 25', function() {

		provider.mapTo(eventName).asSequence().add('Command1').add('Command2');
				
		dispatch({event:eventName},function(){

			expect(resultInjected).toBe(25)
		});
	});


});