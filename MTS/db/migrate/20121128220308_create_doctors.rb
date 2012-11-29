class CreateDoctors < ActiveRecord::Migration
  def change
    create_table :doctors do |t|
      t.string :fio
      t.string :string
      t.string :specialization_id
      t.string :integer
      t.string :time_limit
      t.string :integer

      t.timestamps
    end
  end
end
