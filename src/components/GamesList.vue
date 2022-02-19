<template>
	<div class="mb-10">
		<h3 class="text-3xl mb-5">{{ title }}</h3>
		<div class="flex flex-row flex-wrap justify-start -mx-4">
			<div
				class="basis-1/2 sm:basis-1/4 xl:basis-1/5 px-4 mb-12"
				v-for="game in games"
				:key="game.id"
			>
				<a
					:href="'https://www.twitch.tv/directory/game/' + game.name"
					target="_blank"
					class="block hover:text-orange-700 transition-all hover:scale-105"
				>
					<img
						:src="gameThumbnail(game.box_art_url)"
						alt=""
						class="mb-3 w-full rounded-lg"
					/>
					<span class="block">{{ game.name }}</span>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AppGamesList',
	props: {
		title: {
			type: String,
			required: false,
			default: '',
		},
		games: {
			type: Array,
			required: true,
			default: () => [],
		},
	},
	methods: {
		gameThumbnail(url) {
			url = url.replace('{width}', 460);
			url = url.replace('{height}', 647);

			url = url.replace('52x72', '460x647');
			return url;
		},
	},
};
</script>
