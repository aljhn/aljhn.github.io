<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    const quotes = [
        "You're always higher up on mount stupid than you realize, even when Dunning-Kruger is taken into account.",
        "Be first or be best.",
        "Teach a person to make an engine, and they will never make another game in their life.",
        "If you can't explain it simply, you don't understand it well enough.",
        "Nothing is more permanent than a temporary solution.",
        "Hofstadter's law: It always takes longer than you expect, even when you take Hofstadter's law into account.",
        "It's better to keep your mouth shut and have everyone assume you're stupid than open it and remove all doubt.",
        "Only a fool learns from his own mistakes. The wise man learns from the mistakes of others.",
        "The choice doesn't matter if the outcome is the same.",
        "All models are wrong, but some are useful.",
        "Kernighan's Law: Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."
    ];
</script>

<Meta name="Quotes" />

<div class="grid auto-rows-min gap-5 p-10">
    <h4 class="text-2xl font-semibold">Selected quotes</h4>
    <p class="text-gray-600 dark:text-gray-400">
        Some of my favorite quotes sampled from various places on the internet, which I think about more or less while
        going through life.
    </p>

    <ul class="items-left mt-5 flex flex-col space-y-4 border-t-2 border-current pt-5">
        {#each quotes as quote}
            <li class="p-1">
                <blockquote
                    class="blockquote bg-surface-200 dark:bg-surface-900 rounded-md px-2 py-1 text-lg shadow-md"
                >
                    {quote}
                </blockquote>
            </li>
        {/each}
    </ul>
</div>
