'use client';

interface ContentListToolbarProps {
  showing: number;
  total: number;
  itemLabel: string;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  sort: string;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
}

export function ContentListToolbar({
  showing,
  total,
  itemLabel,
  search,
  onSearchChange,
  searchPlaceholder,
  sort,
  onSortChange,
  sortOptions,
}: ContentListToolbarProps) {
  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-text-secondary dark:text-[#AAA5A0]">
        Showing <span className="font-semibold text-text-primary dark:text-[#F0EDE8]">{showing}</span>{' '}
        of <span className="font-semibold text-text-primary dark:text-[#F0EDE8]">{total}</span>{' '}
        {itemLabel}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="flex-1 bg-bg-surface dark:bg-[#1A1A1A] border border-border-subtle dark:border-[#2A2A2A] rounded-md px-4 py-2.5 text-text-primary dark:text-[#F0EDE8] font-body text-sm placeholder:text-text-muted dark:placeholder:text-[#8A8580] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-150"
        />
        {sortOptions.length > 1 && (
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full sm:w-auto sm:min-w-[220px] bg-bg-surface dark:bg-[#1A1A1A] border border-border-subtle dark:border-[#2A2A2A] rounded-md pl-3 pr-10 py-2.5 text-text-primary dark:text-[#F0EDE8] font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent cursor-pointer appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238A8580'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
