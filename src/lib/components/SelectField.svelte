<script lang="ts">
  import * as Field from '$lib/components/ui/field/index.js';
  import * as Select from '$lib/components/ui/select/index.js';

  type SelectItem = { value: string; label: string };

  interface InputFieldProps {
    id: string;
    label?: string;
    selectItems?: SelectItem[];
    value: string;
    [key: string]: unknown;
  }

  let {
    id,
    label = '',
    value = $bindable(''),
    selectItems = []
  }: InputFieldProps = $props();

  const itemLabel = $derived(
    selectItems.find((item) => item.value === value)?.label ?? 'Choose ' + label
  );
</script>

<Field.Field>
  {#if label}
    <Field.Label for={id}>{label}</Field.Label>
  {/if}
  <Select.Root type="single" bind:value>
    <Select.Trigger {id}>
      {itemLabel}
    </Select.Trigger>
    <Select.Content>
      {#each selectItems as selectItem (selectItem.value)}
        <Select.Item {...selectItem} />
      {/each}
    </Select.Content>
  </Select.Root>
</Field.Field>
