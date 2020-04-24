#!/bin/bash -e

cd "$(dirname "$0")"

echo "Generating terrain_texture.json"

cd resources/textures

cat <<EOF >terrain_texture.json
// AUTOGENERATED - DO NOT EDIT
{
	"resource_pack_name": "elevator",
	"texture_data": {
EOF

sep=
find blocks/ -name "*.png" | while read file; do
	
	tname="$(basename "$file")"
	tname="${tname%.*}"
	
	cat <<EOF >>terrain_texture.json
		$sep
		"${tname}": {
			"textures": [
				"textures/blocks/${tname}"
			]
		}
EOF

	sep=,
done

cat <<EOF >>terrain_texture.json
	}
}
EOF