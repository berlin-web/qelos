import { defineStore } from 'pinia';
import { useDispatcher } from '@/modules/core/compositions/dispatcher';
import { IBlock } from '@/services/types/block';
import blocksService from '@/services/blocks-service';
import { useSubmitting } from '@/modules/core/compositions/submitting';

export const useBlocksList = defineStore('blocks-list', function useBlocksList() {
  const { loading, result, retry } = useDispatcher<IBlock[]>(() => blocksService.getAll(), []);

  const { submit } = useSubmitting(
    ({ _id }) =>
      blocksService.remove(_id).then(() => {
        result.value = result.value.filter((block) => block._id !== _id);
      }),
    {
      success: 'Block removed successfully',
      error: 'Failed to remove block'
    }
  )

  return {
    loading,
    blocks: result,
    removeBlock: submit,
    retry
  }
})
