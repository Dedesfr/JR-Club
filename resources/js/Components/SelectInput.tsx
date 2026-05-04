import ReactSelect, { SingleValue, StylesConfig } from 'react-select';

export type SelectOption = {
    value: string;
    label: string;
};

export const selectInputStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
        ...base,
        minHeight: '48px',
        border: 0,
        borderRadius: '12px',
        backgroundColor: '#f2f4f6',
        boxShadow: state.isFocused ? '0 0 0 2px #003f7b' : 'none',
        fontSize: '0.875rem',
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999,
        borderRadius: '12px',
        overflow: 'hidden',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};

export default function SelectInput({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    isClearable = false,
    disabled = false,
}: {
    options: SelectOption[];
    value: string | number | null | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    isClearable?: boolean;
    disabled?: boolean;
}) {
    const selected = options.find((option) => option.value === String(value ?? '')) ?? null;

    return (
        <ReactSelect<SelectOption, false>
            isDisabled={disabled}
            isClearable={isClearable}
            options={options}
            value={selected}
            onChange={(option: SingleValue<SelectOption>) => onChange(option?.value ?? '')}
            placeholder={placeholder}
            styles={selectInputStyles}
            menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
            menuPosition="fixed"
        />
    );
}
