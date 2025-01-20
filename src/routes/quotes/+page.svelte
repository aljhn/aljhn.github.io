<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    const quotes = [
        "You're always higher up on mount stupid than you realize, even when Dunning-Kruger is taken into account.",
        "Be first or be best.",
        "Teach a person to make an engine, and they will never make another game in their life.",
        "If you can't explain it simply, you don't understand it well enough.",
        "Nothing is more permanent than a temporary solution.",
        "Hofstadter's law: It always takes longer than you expect, even when you take Hofstadter's law into account.",
        "It's better to keep your mouth shut and have everyone asume you're dumb, than open your mouth and remove all doubt.",
        "Only a fool learns from his own mistakes. The wise man learns from the mistakes of others.",
        "The choice doesn't matter if the outcome is the same."
    ];
</script>

<Meta name="Quotes" />

<div class="grid auto-rows-min gap-5 px-10 pt-10">
    <h4 class="text-2xl font-semibold">Selected quotes</h4>
    <p class="text-gray-600 dark:text-gray-400">
        Some of my favorite quotes sampled from various places on the internet, which I think about more or less while
        going through life.
    </p>

    <ul class="mt-5 flex flex-col items-center space-y-4 border-t-2 border-current pt-5">
        {#each quotes as quote}
            <li class="p-2"><blockquote class="blockquote text-lg">{quote}</blockquote></li>
        {/each}
    </ul>
</div>
