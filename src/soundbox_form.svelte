<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { z } from "zod";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "$lib/components/ui/alert";
  import { fromError } from "zod-validation-error";
  import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label";
  import CardFooter from "$lib/components/ui/card/card-footer.svelte";
  import { makeRequest } from "$lib/api";
  import * as Select from "$lib/components/ui/select";

  const formSchema = z.object({
    activation_code: z.string().min(1),
    serial_number: z.string().min(1),
    secret_key: z.string().min(1),
    transaction_status: z.enum(["Approved", "Rejected"]),
    amount: z.number().min(1),
  });

  let { formData } = $props();
  let errors = $state([]);

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    try {
      console.log(formData);
      let form = formSchema.parse(formData);
      const opts = {
        serialNumber: form.serial_number,
        activation: form.activation_code,
        amount: form.amount,
        transactionStatus: form.transaction_status,
      };
      status = "Sending request...";
      const response = await makeRequest(opts, formData.secret_key);
      if (!response.error) {
        responseString = JSON.stringify(response, null, 2);
      } else {
        responseString = JSON.stringify(response.error, null, 2);
      }
      status = "Waiting for request...";
    } catch (e) {
      errors = fromError(e).toString().split(";");
    }
  }

  let status = $state("Waiting for Request...");
  let responseString = $state("Response goes here...");
</script>

<Card class="flex flex-col h-min w-3/4">
  <CardContent class="flex flex-row items-start w-full gap-4">
    <form onsubmit={onSubmit} class="flex flex-col items-start gap-4">
      <div class="flex flex-col items-start gap-4">
        <div class="flex w-full max-w-sm flex-col gap-1.5">
          <Label for="activation_code">Activation Code</Label>
          <Input
            type="text"
            id="activation_code"
            placeholder="Activation Code"
            bind:value={formData.activation_code}
          />
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
          <Label for="serial_number">Serial Number</Label>
          <Input
            type="text"
            id="serial_number"
            placeholder="Serial Number"
            bind:value={formData.serial_number}
          />
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
          <Label for="secret_key">Secret Key</Label>
          <Input
            type="text"
            id="secret_key"
            placeholder="Secret Key"
            bind:value={formData.secret_key}
          />
          <p class="text-sm text-muted-foreground">
            The secret key <b class="font-bold text-red-600"
              >cannot be made public</b
            >. Please ask Justin for the secret key. If you need to share it,
            please use 1Password.
          </p>
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
          <Label for="amount">Amount</Label>
          <Input
            type="number"
            id="amount"
            placeholder="Amount"
            bind:value={formData.amount}
          />
          <p class="text-muted-foreground text-sm">
            Enter the amount in PHP (e.g. 20.00).
          </p>
        </div>
        <div class="flex flex-col items-start gap-1.5 w-full">
          <Label for="transaction_status">Transaction Status</Label>
          <Select.Root
            selected={formData.transaction_status}
            onSelectedChange={(s) => {
              s && (formData.transaction_status = s.value);
            }}
          >
            <Select.Trigger class="w-full">
              <Select.Value placeholder="Transaction Status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="Approved">Approved</Select.Item>
              <Select.Item value="Rejected">Rejected</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
      <div>
        <Button type="submit">Trigger Soundbox</Button>
      </div>
    </form>
    <Card class="flex flex-col items-start gap-4 w-full">
      <CardHeader>
        <CardTitle>{status}</CardTitle>
      </CardHeader>
      <CardContent class="font-mono bg-slate-100 w-full min-h-96 h-full">
        <p>{responseString}</p>
      </CardContent>
    </Card>
  </CardContent>
  <CardFooter>
    {#if errors.length > 0}
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {#each errors as error}
            <p>{error}</p>
          {/each}
        </AlertDescription>
      </Alert>
    {/if}
  </CardFooter>
</Card>
