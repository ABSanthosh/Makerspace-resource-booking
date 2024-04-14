<script lang="ts">
  import type { IToast } from '$store/ToastStore';
  import { backInOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  export let { message, timeout, type = 'default', id } = $$props as IToast;
</script>

<span
  {id}
  on:outroend
  class="Toast"
  on:introstart
  data-type={type}
  transition:fly={{ y: 50, duration: 500, easing: backInOut }}
>
  {message}
</span>

<style lang="scss">
  .Toast {
    gap: 5px;
    right: 50%;
    bottom: 20px;
    z-index: 100;
    color: #fefefe;
    position: fixed;
    padding: 10px 15px 10px 13px;
    border-radius: 50px;
    white-space: nowrap;
    transform: translateX(50%);
    @include make-flex($dir: row);
    // border: 1px solid #d0d7de;
    box-shadow: 0px 2px 30px 3px rgba(0, 0, 0, 0.25);

    &::before {
      content: '';
      @include make-flex();
      @include box(20px, 20px);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }

    &[data-type='default'],
    &:not([data-type]) {
      background-color: #272727;

      &::before {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZWZlZmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWluZm8iPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PHBhdGggZD0iTTEyIDE2di00Ii8+PHBhdGggZD0iTTEyIDhoLjAxIi8+PC9zdmc+');
      }
    }

    &[data-type='info'] {
      background-color: #3498db;

      &::before {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZWZlZmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWluZm8iPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PHBhdGggZD0iTTEyIDE2di00Ii8+PHBhdGggZD0iTTEyIDhoLjAxIi8+PC9zdmc+');
      }
    }

    &[data-type='success'] {
      background-color: #2ecc71;

      &::before {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZWZlZmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS1jaGVjayI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJtOSAxMiAyIDIgNC00Ii8+PC9zdmc+');
      }
    }

    &[data-type='warning'] {
      color: #11181c;
      background-color: #f1c40f;

      &::before {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTE4MWMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRyaWFuZ2xlLWFsZXJ0Ij48cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiLz48cGF0aCBkPSJNMTIgOXY0Ii8+PHBhdGggZD0iTTEyIDE3aC4wMSIvPjwvc3ZnPg==');
      }
    }

    &[data-type='danger'] {
      background-color: #e74c3c;

      &::before {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZWZlZmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW9jdGFnb24tYWxlcnQiPjxwb2x5Z29uIHBvaW50cz0iNy44NiAyIDE2LjE0IDIgMjIgNy44NiAyMiAxNi4xNCAxNi4xNCAyMiA3Ljg2IDIyIDIgMTYuMTQgMiA3Ljg2IDcuODYgMiIvPjxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iOCIgeTI9IjEyIi8+PGxpbmUgeDE9IjEyIiB4Mj0iMTIuMDEiIHkxPSIxNiIgeTI9IjE2Ii8+PC9zdmc+');
      }
    }
  }
</style>
