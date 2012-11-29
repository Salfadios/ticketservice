class CreateWorkingTimes < ActiveRecord::Migration
  def change
    create_table :working_times do |t|
      t.string :doctor_id
      t.string :integer
      t.string :working_time_json_hash

      t.timestamps
    end
  end
end
