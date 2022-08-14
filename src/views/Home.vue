<template>
    <div>
        <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100"></bounce-loader>
        <PxAssetsTableComponent v-if="!isLoading" :assets="assets"></PxAssetsTableComponent>
    </div>
</template>

<script>

    import api from "@/api";
    import PxAssetsTableComponent from '@/components/PxAssetsTableComponent.vue'

    export default {
        name: 'Home',
        components: {
            PxAssetsTableComponent
        },
        data() {
            return {
                assets: [],
                isLoading: false
            }
        },
        created() {
            this.isLoading = true;
            api.getAssets()
               .then( assets => (this.assets = assets))
               .finally(() => this.isLoading = false)
        }
    }
    
</script>