<template>
  <section class="landing-section">
    <div class="landing-container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-lg-5">
          <q-badge outline color="primary"> Workspace </q-badge>

          <h2 class="section-title">More than an AI upload box.</h2>

          <p class="text-grey-7 text-body1">
            Keep documents organized as your workspace grows using folders, tags
            and favorites.
          </p>
        </div>

        <div class="col-12 col-lg-7">
          <q-card flat bordered class="organization-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">
                Workspace
              </div>

              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="star" color="amber" />
                  </q-item-section>

                  <q-item-section> Favorites </q-item-section>

                  <q-item-section side> 8 </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="folder" color="primary" />
                  </q-item-section>

                  <q-item-section> Research </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="folder" color="primary" />
                  </q-item-section>

                  <q-item-section> University </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="folder" color="primary" />
                  </q-item-section>

                  <q-item-section> Work </q-item-section>
                </q-item>
              </q-list>

              <q-separator class="q-my-md" />

              <div class="text-caption text-grey-7 q-mb-sm">Tags</div>

              <div class="row q-gutter-sm">
                <q-chip color="blue-1" text-color="primary"> AI </q-chip>

                <q-chip color="purple-1" text-color="purple"> Backend </q-chip>

                <q-chip color="green-1" text-color="positive">
                  Research
                </q-chip>

                <q-chip color="orange-1" text-color="orange"> Reports </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.organization-card {
  border-radius: 20px;
}
</style>
