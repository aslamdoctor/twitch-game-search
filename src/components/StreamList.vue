<template>
	<div>
		<h3 class="text-3xl mb-5">{{ title }}</h3>
		<div class="flex flex-row flex-wrap justify-start -mx-4">
			<div
				class="basis-1/2 sm:basis-1/4 xl:basis-1/5 px-4 mb-12"
				v-for="stream in streams"
				:key="stream.id"
			>
				<a
					:href="
						'https://www.twitch.tv/' +
						(stream.user_name || stream.broadcaster_login)
					"
					class="block hover:text-orange-700 transition-all hover:scale-105"
					target="_blank"
				>
					<img
						:src="streamThumbnail(stream.thumbnail_url)"
						alt=""
						class="mb-3 w-full rounded-lg"
					/>
					<span class="block">
						{{ stream.user_name || stream.display_name }}
					</span>
					<span class="block opacity-50">{{ stream.game_name }}</span>
					<span class="block text-sm font-light">{{ stream.title }}</span>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AppStreamList',
	props: {
		title: {
			type: String,
			required: false,
			default: '',
		},
		streams: {
			type: Array,
			required: true,
			default: () => [],
		},
	},
	methods: {
		streamThumbnail(url) {
			url = url.replace('{width}', 460);
			url = url.replace('{height}', 258);
			//url = url.replace('300x300', '460x258');
			return url;
		},
	},
};
</script>
