<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
  } from "$lib/components/ui/table";

  let { filteredData } = $props<{
    filteredData: {
      trade_name: string;
      serial_number: string;
      activation_code: string;
    }[];
  }>();

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  }
</script>

<main>
  <Table class="w-full">
    <TableHeader>
      <TableRow>
        <TableHead>Trade Name</TableHead>
        <TableHead>Serial Number</TableHead>
        <TableHead>Activation Code</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each filteredData as fixture}
        <TableRow>
          <TableCell>{fixture.trade_name}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              on:click={() => copyToClipboard(fixture.serial_number)}
            >
              {fixture.serial_number}
            </Button>
          </TableCell>
          <TableCell>
            <Button
              variant="outline"
              on:click={() => copyToClipboard(fixture.activation_code)}
            >
              {fixture.activation_code}
            </Button>
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</main>
