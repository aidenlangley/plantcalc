<script lang="ts">
  import * as Field from '$lib/components/ui/field/index.js';
  import { Input } from '$lib/components/ui/input/index.js';

  type InputFieldType = 'text' | 'number';

  interface InputFieldProps {
    id: string;
    label?: string;
    type: InputFieldType;
    value: string | number;
    [key: string]: unknown;
  }

  let {
    id,
    label = '',
    type = <InputFieldType>'text',
    value = $bindable(''),
    ...restProps
  }: InputFieldProps = $props();
</script>

<Field.Field>
  <!-- If we didn't supply a labe, then leave it out. -->
  {#if label}
    <Field.Label for={id}>{label}</Field.Label>
  {/if}
  <Input {id} {type} bind:value {...restProps} />
</Field.Field>
