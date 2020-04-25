'use strict';

const LOG_ENABLED = true;
const GUIDE_IDS = [
	'orca:elevator_guide',
	'orca:elevator_guide_basement',
	'orca:elevator_guide_floor'
];

const CARDINAL_VECTORS = [
	{x:  0, z: +1},  // North
	{x:  0, z: -1}, // South
	{x: +1, z:  0}, // East
	{x: -1, z:  0}  // West
];

const system = server.registerSystem(0, 0);

system.initialize = function() {
	if (LOG_ENABLED) {
		let loggerData = system.createEventData('minecraft:script_logger_config');
		loggerData.data.log_information = true;
		loggerData.data.log_warnings = true;
		loggerData.data.log_errors = true;
		system.broadcastEvent('minecraft:script_logger_config', loggerData);
	}

	system.listenForEvent('minecraft:player_placed_block', (e) => this.onBlockPlaced(e));
};

system.onBlockPlaced = function(eventData) {
	const world = this.getComponent(eventData.data.player, 'minecraft:tick_world');
	if (world === null) {
		return;
	}

	const area = world.data.ticking_area;
	const blockPosition = eventData.data.block_position;

	const placedBlock = this.getBlock(area, blockPosition);
	if (placedBlock === null || placedBlock.__identifier__ !== 'orca:elevator_kit') {
		return;
	}

	const nearbyGuide = this.findNearbyGuide(area, blockPosition);
	if (!nearbyGuide) {
		return;
	}

	this.executeCommand(`/setblock ${blockPosition.x} ${blockPosition.y} ${blockPosition.z} air`, (eventData) => {
		if (eventData.data.statusCode !== 0) {
			return;
		}

		const elevator = this.createEntity("entity", "orca:elevator_building");
		if (!elevator) {
			return;
		}

		const angleToGuide = Math.atan2(blockPosition.x - nearbyGuide.block_position.x, blockPosition.z - nearbyGuide.block_position.z);

		const elevatorPos = this.createComponent(elevator, "minecraft:position");
		elevatorPos.data.x = blockPosition.x + Math.sin(angleToGuide) * 0.53 + 0.5;
		elevatorPos.data.y = blockPosition.y + 0.1;
		elevatorPos.data.z = blockPosition.z + Math.cos(angleToGuide) * 0.53 + 0.5;
		this.applyComponentChanges(elevator, elevatorPos);

		const elevatorRot = this.createComponent(elevator, "minecraft:rotation");
		elevatorRot.data.y = Math.round(-180 * angleToGuide / Math.PI);
		this.applyComponentChanges(elevator, elevatorRot);
	});
};

system.findNearbyGuide = function(area, position) {
	const {x, y, z} = position;

	for (let vec of CARDINAL_VECTORS) {
		const block = this.getBlock(area, x + vec.x, y, z + vec.z);
		if (this.isGuideBlock(block)) {
			return block;
		}
	}

	return null;
};

system.isGuideBlock = function(block) {
	return block && GUIDE_IDS.indexOf(block.__identifier__) >= 0;
};

// From https://minecraft.gamepedia.com/Bedrock_Edition_beta_scripting_documentation

system.emit = function(identifier, properties) {
	const data = this.createEventData(identifier);
	data.data = Object.assign({}, data.data, properties);
	return this.broadcastEvent(identifier, data);
};

if (LOG_ENABLED) {
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
} else {
	system.log = function() { };
}
