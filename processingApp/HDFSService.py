from pyhdfs import HdfsClient

class HDFSSErvice:

    namenode_host = "localhost"
    namenode_port = "9870"
    root_folder = "/"
    chunck_size = 100000

    def __init__(self):
        self._client = HdfsClient(hosts=self.namenode_host + ":" + self.namenode_port, user_name="root")

    def get(self, hdfs_path: str):
        file_size = self.get_file_size(hdfs_path)
        for i in range(0, file_size, self.chunck_size):
            file_response = self._client.open(hdfs_path, offset=i, length=i + self.chunck_size)
            yield file_response.read()
        
    def append(self, hdfs_path: str, data: bytes):
        self.create_if_not_exist(hdfs_path)
        self._client.append(hdfs_path, data)
    
    def create_if_not_exist(self, hdfs_path: str):
        if not self._client.exists(hdfs_path):
            self._client.create(hdfs_path, b"")

    def get_messages_number(self, hdfs_path: str):
        return int(self.get_file_size(hdfs_path) / self.chunck_size + 1)

    def get_file_size(self, hdfs_path):
        file_infos = self._client.get_content_summary(hdfs_path)
        return file_infos.length

    def test(self):
        pass