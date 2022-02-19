<template>
	<header class="bg-yellow-400 p-3 text-center">
		<h1
			class="text-2xl text-orange-700 uppercase cursor-pointer"
			@click="$emit('clear-search')"
		>
			Twitch Game Search
		</h1>
	</header>
</template>

<script>
export default {
	name: 'AppHeader',
};
</script>
