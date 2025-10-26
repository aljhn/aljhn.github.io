<script lang="ts">
    import Meta from "$lib/Meta.svelte";

    const quotes: string[] = [
        "You're always higher up on mount stupid than you realize, even when Dunning-Kruger is taken into account.",
        "Teach a person to make an engine, and they will never make another game in their life.",
        "If you can't explain it simply, you don't understand it well enough.",
        "Nothing is more permanent than a temporary solution.",
        "Hofstadter's law: It always takes longer than you expect, even when you take Hofstadter's law into account.",
        "It's better to keep your mouth shut and have everyone assume you're stupid than open it and remove all doubt.",
        // "Only a fool learns from his own mistakes. The wise man learns from the mistakes of others.",
        "The choice doesn't matter if the outcome is the same.",
        // "Be first or be best.",
        // "Kernighan's Law: Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
        "Bench more to bench more."
    ];

    function shuffleArray<T>(array: T[]): void {
        const n: number = array.length;
        for (let i: number = 0; i < n; i++) {
            const j: number = Math.floor(Math.random() * n);
            const temp: T = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    shuffleArray(quotes);
</script>

<Meta name="Quotes" />

<div class="grid auto-rows-min gap-5 p-10 text-textlight-2 dark:text-textdark-2">
    <h2 class="font-mono text-2xl font-semibold text-textlight-1 dark:text-textdark-1">Selected Quotes</h2>
    <p>Interesting quotes sampled from various places on the internet. Order randomized.</p>

    <ul class="items-left mt-5 flex flex-col space-y-4 border-t-2 border-current pt-5">
        {#each quotes as quote}
            <li class="p-1">
                <blockquote
                    class="blockquote rounded-md bg-bglight-2 px-3 py-3 text-lg shadow-lg dark:bg-bgdark-2"
                >
                    {quote}
                </blockquote>
            </li>
        {/each}
    </ul>
</div>
