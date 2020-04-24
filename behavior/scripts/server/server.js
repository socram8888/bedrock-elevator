'use strict';

const system = server.registerSystem(0, 0);

system.initialize = function() {
    let loggerData = system.createEventData("minecraft:script_logger_config");
    loggerData.data.log_information = true;
    loggerData.data.log_warnings = true;
    loggerData.data.log_errors = true;
    system.broadcastEvent("minecraft:script_logger_config", loggerData);

	system.listenForEvent("minecraft:player_placed_block", (e) => this.onBlockPlaced(e));
};

system.onBlockPlaced = function(eventData) {
	this.log(eventData);
};

// From https://minecraft.gamepedia.com/Bedrock_Edition_beta_scripting_documentation

system.emit = function(identifier, properties) {
	const data = this.createEventData(identifier);
	data.data = Object.assign({}, data.data, properties);
	return this.broadcastEvent(identifier, data);
};

system.log = function(...items) {
	const toString = item => {
		switch(Object.prototype.toString.call(item)) {
			case '[object Undefined]':
				return 'undefined';
			case '[object Null]':
				return 'null';
			case '[object String]':
				return `"${item}"`;
			case '[object Array]':
				const array = item.map(toString);
				return `[${array.join(', ')}]`;
			case '[object Object]':
				const object = Object.keys(item).map(key => `${key}: ${toString(item[key])}`);
				return `{${object.join(', ')}}`;
			case '[object Function]':
				return item.toString();
			default:
				return item;
		}
	};

	this.emit('minecraft:display_chat_event', {message: items.map(toString).join(' ')});
};
