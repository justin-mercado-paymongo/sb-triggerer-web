<script lang="ts">
  import "./app.css";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
  } from "$lib/components/ui/card";
  import Alert from "$lib/components/ui/alert/alert.svelte";
  import CardDescription from "$lib/components/ui/card/card-description.svelte";
  import { Input } from "$lib/components/ui/input";
  import data from "./fixture.json";
  import SoundboxForm from "./soundbox_form.svelte";

  let search = $state("");
  function onChange(e: Event) {
    search = (e.target as HTMLInputElement).value;
  }

  let filteredData = $derived(
    data.filter((fixture) =>
      fixture.trade_name.toLowerCase().includes(search.toLowerCase())
    )
  );

  let formData = $state({
    activation_code: "",
    serial_number: "",
    amount: 20,
    secret_key: "",
    transaction_status: "Approved",
  });
</script>

<main class="flex gap-8 p-20">
  <div class="w-1/3 flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Instructions</h1>
    <ol>
      <li>1. The Soundbox needs to be turned on to receive requests</li>
        <li>
          2. Enter the Activation Code and Serial Number. Use the linked
          spreadsheet for reference.
        </li>
        <li>3. Enter the Secret Key into the "Secret Key" field</li>
        <li>4. Click the button to trigger the Soundbox</li>
        <li>5. The response will be shown here</li>
      </ol>
      <Alert variant="destructive">
        WARNING: Accidentally triggering a production Soundbox will actually
        play audio. 
      </Alert>
    <Card class="flex flex-col gap-2 rounded-none">
      <CardContent class="flex justify-center">
        <a
          class="text-lg text-blue-500 hover:underline"
          href="https://docs.google.com/spreadsheets/d/1ScSMoB5aJUNC_LUtPqXVmFFN3HrH4e8xIXfVX7W_5Vk/edit?gid=0#gid=0"
          >Complete Soundbox List</a
        >
      </CardContent>
    </Card>
  </div>
  <SoundboxForm {formData} />
</main>

<style lang="postcss">
</style>
